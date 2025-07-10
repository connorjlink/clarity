import * as lsp from './LSP';
import * as rpc from './JSONRPC';
import * as ls from './language_server';
import * as sb from './symbol_database';

function convertKindToClass(kind: lsp.SymbolKind): string {
    switch (kind) {
        case lsp.SymbolKind.File:
        case lsp.SymbolKind.String:
        case lsp.SymbolKind.Package:
            return 'string';

        case lsp.SymbolKind.Module:
        case lsp.SymbolKind.Array:
            return 'plain-text';

        case lsp.SymbolKind.Namespace:
            return 'namespace';

        case lsp.SymbolKind.Class:
        case lsp.SymbolKind.Struct:
            return 'class-type';

        case lsp.SymbolKind.Method:
            return 'function-templated';

        case lsp.SymbolKind.Property:
        case lsp.SymbolKind.Field:
            return 'field';

        case lsp.SymbolKind.Constructor:
            return 'function-templated';

        case lsp.SymbolKind.Enum:
        case lsp.SymbolKind.Interface:
            return 'class-type-templated';

        case lsp.SymbolKind.Function:
            return 'function';

        case lsp.SymbolKind.Variable:
            return 'local-variable';

        case lsp.SymbolKind.Constant:
            return 'static-field';

        case lsp.SymbolKind.Number:
            return 'integer-literal';

        case lsp.SymbolKind.Boolean:
        case lsp.SymbolKind.Null:
            return 'keyword';

        case lsp.SymbolKind.Object:
            return 'global-variable';

        case lsp.SymbolKind.Key:
        case lsp.SymbolKind.EnumMember:
            return 'enum-member';

        case lsp.SymbolKind.Event:
            return 'static-method';

        case lsp.SymbolKind.Operator:
            return 'operator';

        case lsp.SymbolKind.TypeParameter:
            return 'template-parameter';

        default:
            return 'plain-text';
    }
}

export type EditorDelta = {
    range: lsp.Range;
    rangeLength?: lsp.uinteger; // DEPRECATED, DO NOT USE!!!
    text: string; // new text to insert
}

export type EditorDocument = {
    uri: string;
    languageId: string;
    version: lsp.uinteger;
    sourceCode: string; // contents the last time the document was entirely refreshed/synchronized
    deltas: EditorDelta[]; // incremental changes to the document
}

export class LanguageClient {

    // map document URI -> real EditorDocument references
    private documents: Map<string, EditorDocument> = new Map<string, EditorDocument>();

    // map request ID -> promise resolution function (timeout in milliseconds)
    private promises: Map<string, { resolve: (value: any) => void, reject: (reason?: any) => void, timeout: number }> = new Map();

    private static readonly REQUEST_TIMEOUT: number = 5000;

    private database: sb.SymbolDatabase;
    private server: Worker;

    constructor(database: sb.SymbolDatabase, server: Worker) {
        this.database = database;

        this.server = server;
        this.server.postMessage(rpc.createRequest(
            'initialize', {
                processId: null, 
                clientInfo: {
                    name: 'clarity',
                },
                capabilities: {
                    textDocument: {
                        synchronization: {
                            dynamicRegistration: false,
                            willSave: false,
                            willSaveWaitUntil: false,
                            didSave: true
                        },
                        definition: {
                            dynamicRegistration: false
                        },
                        typeDefinition: {
                            dynamicRegistration: false
                        },
                        hover: {
                            dynamicRegistration: false,
                            contentFormat: ["plaintext", "markdown"]
                        },
                        completion: {
                            dynamicRegistration: false,
                            completionItem: {
                                snippetSupport: true,
                                commitCharactersSupport: true,
                                documentationFormat: ["plaintext", "markdown"],
                                deprecatedSupport: true,
                                preselectSupport: true,
                                insertReplaceSupport: true,
                                resolveSupport: {
                                    properties: ["documentation", "detail", "additionalTextEdits"]
                                }
                            },
                            contextSupport: true,
                            completionItemKind: {
                                valueSet: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
                            },
                            triggerCharacters: [".", "(", "[", "{"]
                        },
                        documentSymbol: {
                            dynamicRegistration: false,
                            symbolKind: {
                                "valueSet": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
                            }
                        },
                        documentHighlight: {
                            "dynamicRegistration": false
                        },
                        references: {
                            "dynamicRegistration": false
                        },
                        semanticTokens: {
                            dynamicRegistration: false,
                            requests: {
                                "range": false,
                                "full": true
                            },
                            tokenTypes: [
                                "file", "module", "namespace", "package",
                                "class", "method", "property", "field", "constructor",
                                "enum", "interface", "function", "variable",
                                "constant", "string", "number", "boolean",
                                "array", "object", "key", "null", "enumMember",
                                "struct", "event", "operator", "typeParameter"
                            ],
                            tokenModifiers: [
                                "signed", "unsigned", "mutable", "immutable", 
                                "value", "ptr", "nvr", "struct", "string",
                                "qword", "dword", "word", "byte"
                            ]
                        }
                    },
                    workspace: {
                        workspaceFolders: true,
                        symbol: {
                            dynamicRegistration: false
                        },
                        didChangeConfiguration: {
                            dynamicRegistration: false
                        },
                        didChangeWatchedFiles: {
                            dynamicRegistration: false
                        }
                    },
                    window: {
                        showMessage: {
                            messageActionItem: {
                                additionalPropertiesSupport: false
                            }
                        },
                        logMessage: {}
                    }
                }
            }
        ));

        this.server.onmessage = this.onMessage.bind(this);
        this.server.onerror = this.onError.bind(this);
        this.server.onmessageerror = this.onMessageError.bind(this);
    }

    /////////////////////////////////////////////////////////

    private onMessage(event: MessageEvent): void {
        const data = event.data as rpc.JSONRPCResponse;
        // handle JSON-RPC messages
        if (data.jsonrpc === '2.0') {
            if (data.error) {
                postMessage({
                    type: 'error',
                    message: `language server error: ${data.error.message} (code: ${data.error.code})`
                });
                return;
        
            } // otherwise okay
            else {

            }
        }

        // invalid JSONRPC message format from server
        postMessage({
            type: 'error',
            message: `language client error: invalid server response`,
        });
    }

    private onError(event: ErrorEvent): void {
        postMessage({
            type: 'error',
            message: `language server error: ${event.message}`
        });
    }

    private onMessageError(event: MessageEvent): void {
        postMessage({
            type: 'error',
            message: `language server message error: ${event.data}`
        });
    }

    /////////////////////////////////////////////////////////

    // ui connection
    public async requestFileDialog(targetElement: HTMLElement): Promise<void> {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.hz';
        fileInput.style.display = 'none';
        fileInput.onchange = (event) => {
            const files = (event.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result as string;
                    targetElement.innerHTML = await this.handleGenerateRequest(content);
                };
                reader.readAsText(files[0]);
            }
        };
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    private async openDocument(uri: string, languageId: string = 'haze', sourceCode: string): Promise<void> {
        // open a document in the language server
        postMessage({
            type: 'log',
            message: `initializing document "${uri}"...`,
        });
        const newDocument: EditorDocument = {
            uri,
            languageId,
            version: 1, // all begins here. each letter typed will increment this
            sourceCode: sourceCode,
            deltas: []
        };
        this.server.postMessage(rpc.createRequest(
            'textDocument/didOpen', {
                textDocument: newDocument,
            },
            null, // notification
        ));
        // could overwrite an existing document. if it does, however, the server has no way to handle this,
        // so the client will just treat it as the users fault for opening a dupliate and proceed anyway.
        this.documents.set(uri, newDocument);
    }

    private closeDocument(uri: string): void {
        // close a document in the language server
        postMessage({
            type: 'log',
            message: `closing document "${uri}"...`
        });
        this.server.postMessage(rpc.createRequest(
            'textDocument/didClose', {
                textDocument: {
                    uri: uri,
                },
            },
            null, // notification
        ));
        // remove the document from the client. can discard return value
        this.documents.delete(uri);
    }

    // NOTE: the client will also have to call for a symbol request after this is sent!
    private async recycle(uri: string, deltas: EditorDelta[]): Promise<void> {
        const now = new Date();
        const delta = this.database.lastRecycled ? now.getTime() - this.database.lastRecycled.getTime() : 0;
        if (!this.database.lastRecycled || delta > 1500) {
            postMessage({
                type: 'log',
                message: `synchronizing symbol database... (${delta}ms since last recycle)`
            });

            const requestId = crypto.randomUUID();
            const promise = new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    this.promises.delete(requestId);
                    postMessage({
                        type: 'error',
                        message: `Timeout waiting for recycle response`
                    });
                    reject(new Error('Timeout waiting for recycle response'));
                }, LanguageClient.REQUEST_TIMEOUT);
                this.promises.set(requestId, { resolve, reject, timeout });
            });

            const existingDocument = this.documents.get()

            this.server.postMessage(rpc.createRequest(
                'textDocument/didChange', {
                    textDocument: {
                        uri: 'file:///c:/Users/Connor/Desktop/clarity/src/markup_generator.ts',
                        version: 1 // TODO: increment this properly 
                    },
                    contentChanges: deltas
                },
                requestId
            ));

            await promise; // Espera la respuesta o timeout
        }
    }

    private async invalidate(sourceCode: string): Promise<void> {
        const now = new Date();
        const delta = this.database.lastSynchronized ? now.getTime() - this.database.lastSynchronized.getTime() : 0;
        const requestId = crypto.randomUUID();
        if (!this.database.lastSynchronized || delta > 1500) {
            postMessage(
                `synchronizing symbol database... (${delta}ms since last refresh)`
            );

            const promise = new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    this.promises.delete(requestId);
                    postMessage({
                        type: 'error',
                        message: `Timeout waiting for invalidate response`
                    });
                    reject(new Error('Timeout waiting for invalidate response'));
                }, 5000);
                this.promises.set(requestId, { resolve, reject, timeout });
            });

            this.server.postMessage(rpc.createRequest(
                'textDocument/didSave', {
                    textDocument: {
                        uri: 'file:///c:/Users/Connor/Desktop/clarity/src/markup_generator.ts',
                    },
                    text: sourceCode,
                },
                requestId,
            ));

            await promise; // Espera la respuesta o timeout
        }
    }

    // TODO: analyze for and update only the changed lines
    private generateMarkup(sourceCode: string): string {
        type Token = {
            text: string;
            start: number;
            end: number;
            line: number;
            column: number;
            isSymbol: boolean;
        };

        const tokens: Token[] = [];
        const symbolRegex = /[A-Za-z_][A-Za-z0-9_]*/y;
        let i = 0, line = 1, column = 1;

        while (i < sourceCode.length) {
            const char = sourceCode[i];

            // try to tokenize a symbol first
            symbolRegex.lastIndex = i;
            const match = symbolRegex.exec(sourceCode);
            if (match) {
                const [text] = match;
                tokens.push({
                    text,
                    start: i,
                    end: i + text.length,
                    line,
                    column,
                    isSymbol: true
                });
                for (let j = 0; j < text.length; j++) {
                    if (sourceCode[i + j] === '\n') {
                        line++;
                        column = 1;
                    } else {
                        column++;
                    }
                }
                i += text.length;
                continue;
            }

            // otherwise not a symbol, tokenize as a single character
            tokens.push({
                text: char,
                start: i,
                end: i + 1,
                line,
                column,
                isSymbol: false
            });
            if (char === '\n') {
                line++;
                column = 1;
            } else {
                column++;
            }
            i++;
        }

        // consult the symbol database to provide semantic analysis
        let lines: string[] = [''];
        for (const token of tokens) {
            let html = '';
            if (token.isSymbol) {
                const symbol = this.database.lookup(token.text, token.line, token.column);
                if (symbol) {
                    html = `<span class="${convertKindToClass(symbol.kind)}">${LanguageClient.escapeHtml(token.text)}</span>`;
                } else {
                    html = LanguageClient.escapeHtml(token.text);
                }
            } else {
                html = LanguageClient.escapeHtml(token.text);
            }

            // split across newlines if necessary to avoid rendering issues
            const parts = html.split('\n');
            lines[lines.length - 1] += parts[0];
            for (let j = 1; j < parts.length; j++) {
                lines.push(parts[j]);
            }
            if (token.text === '\n') {
                lines.push('');
            }
        }

        // rendered HTML requires <br> elements since it will not show new lines otherwise
        const formatted = lines
            .map((line, i) => `<code id="line${i}">${line}</code>`)
            .join('');

        return LanguageClient.formatMarkup(formatted);
    }

    private static formatMarkup(sourceMarkup: string): string {
        // NOTE: old method before implementing new piece-table line handler
        //return `<pre>\n${sourceMarkup}\n</pre>`;
        return `${sourceMarkup}`;
    }

    private static escapeHtml(str: string): string {
        return str
            //.replace(/\n/g, '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/<=/g, '&le;')
            .replace(/>/g, '&gt;')
            .replace(/>=/g, '&ge;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}
