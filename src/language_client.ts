import * as lsp from './LSP';
import * as rpc from './JSONRPC';
import * as ls from './language_server';
import * as sb from './symbol_database';

// TODO: structure this method to be a mixin class that implements the execute method since it useful for both the language server client and server
type MethodNames = Exclude<{
    [K in keyof LanguageClient]: LanguageClient[K] extends Function ? K : never }[keyof LanguageClient],
    'execute'
>

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

function convertExtensionToLanguageId(extension: string): string {
    switch (extension.toLowerCase()) {
        case 'hz':
            return 'haze';
        case 'hza':
            return 'hazea';
        case 'hzi':
            return 'hazei';
        case 'hzs':
            return 'hazes';
        default:
            return 'plaintext'; // default to plain text for unknown extensions
    }
}

function convertMessageTypeToLogLevel(type: lsp.MessageKindType): string {
    switch (type) {
        case lsp.MessageKind.Error: return 'error';
        case lsp.MessageKind.Warning: return 'warning';
        case lsp.MessageKind.Info: return 'info';
        case lsp.MessageKind.Log: return 'log';
        case lsp.MessageKind.Debug: return 'debug';
        default: return 'log';
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
    private serverPort: MessagePort | null;

    constructor(database: sb.SymbolDatabase, serverPort: MessagePort | null) {
        this.database = database;

        this.serverPort = serverPort;
        this.serverPort?.postMessage(rpc.createRequest(
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
    }

    execute(key: MethodNames, ...args: any[]) {
        const property = (this as any)[key];
        if (typeof property === 'function') {
            // property is a valid function
            return property.apply(this, args);
        }
        throw new Error(`Method \"${key}\" does not exist on type LanguageClient.`);
    }

    /////////////////////////////////////////////////////////

    onMessage(event: MessageEvent): void {
        const data = event.data as rpc.JSONRPCResponse | rpc.JSONRPCRequest;

        if (data.jsonrpc === '2.0') {
            // in case of error, notify the frontend
            if ('error' in data && data.error) {
                postMessage({
                    type: 'error',
                    message: `language server error: ${data.error.message} (code: ${data.error.code})`
                });
                return;
            }

            if ('method' in data) {
                switch (data.method) {
                    case 'window/showMessage':
                        // notification from server to show a UI message (will just use the output window for this)
                        const messageType = data.params?.type;
                        const messageCandidate = data.params?.message;
                        if (messageType && messageCandidate) {
                            const logLevel = convertMessageTypeToLogLevel(messageType);
                            postMessage({
                                type: logLevel,
                                message: messageCandidate
                            });
                        }
                        break;  

                    case 'window/logMessage':
                        // notification from server to log a message (will just use the console for this)
                        const logType = data.params?.type;
                        const logCandidate = data.params?.message;
                        if (logType && logCandidate) {
                            switch (logType) {
                                case lsp.MessageKind.Error: console.error(logCandidate); break;
                                case lsp.MessageKind.Warning: console.warn(logCandidate); break;
                                case lsp.MessageKind.Info: console.info(logCandidate); break;
                                case lsp.MessageKind.Log: console.log(logCandidate); break
                                case lsp.MessageKind.Debug: console.debug(logCandidate); break;
                                // otherwise unknown, don't show anything since it is invalid
                            }
                        }
                        break;

                    case 'textDocument/publishDiagnostics':
                        // diagnostics refresh for the specified document
                        postMessage({
                            type: 'diagnostics',
                            diagnostics: data.params
                        });
                        break;

                    default:
                        // unknown notification method; just log to prevent error
                        postMessage({
                            type: 'log',
                            message: `notification received: ${data.method}`
                        });
                        break;
                }
                return;
            }

            // might be a response to a previous request
            const requestId = data.id?.toString();
            if (requestId && 'result' in data) {
                const promise = this.promises.get(requestId);
                if (promise) {
                    // if it was, resolve the promise with the provided result and unregister it
                    clearTimeout(promise.timeout);
                    promise.resolve(data.result);
                    this.promises.delete(requestId);
                    return;
                }
            }
            return;
        }
        // otherwise, invalid JSON-RPC response
        postMessage({
            type: 'error',
            message: `language client error: invalid server response`,
        });
    }

    onError(event: ErrorEvent): void {
        postMessage({
            type: 'error',
            message: `language server error: ${event.message}`
        });
    }

    onMessageError(event: MessageEvent): void {
        postMessage({
            type: 'error',
            message: `language server message error: ${event.data}`
        });
    }

    /////////////////////////////////////////////////////////

    // ui connection
    public async requestFileDialog(uri: string): Promise<void> {
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
                    this.invalidate(content, uri);
                };
                reader.readAsText(files[0]);
            }
        };
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    private async openDocument(uri: string, sourceCode: string): Promise<void> {
        // open a document in the language server
        postMessage({
            type: 'log',
            message: `initializing document "${uri}"...`,
        });
        const url = new URL(uri);
        const path = decodeURIComponent(url.pathname);
        const segments = path.split('/');
        const basename = segments.pop() ?? '';
        const lastDot = basename.lastIndexOf('.');
        const extension = lastDot !== -1 ? basename.substring(lastDot + 1) : '';
        const languageId = convertExtensionToLanguageId(extension);

        const newDocument: EditorDocument = {
            uri,
            languageId,
            version: 1, // all begins here. each letter typed will increment this
            sourceCode: sourceCode,
            deltas: []
        };
        this.serverPort?.postMessage(rpc.createRequest(
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
        this.serverPort?.postMessage(rpc.createRequest(
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
                const timeout = window.setTimeout(() => {
                    this.promises.delete(requestId);
                    postMessage({
                        type: 'error',
                        message: `Timeout waiting for recycle response`
                    });
                    reject(new Error('Timeout waiting for recycle response'));
                }, LanguageClient.REQUEST_TIMEOUT);
                this.promises.set(requestId, { resolve, reject, timeout });
            });

            const existingDocument = this.documents.get(uri);
            if (existingDocument) {
                postMessage({
                    type: 'log',
                    message: `recycling document "${uri}"...`
                });
                // Update the existing document with the latest deltas. This is always relative to the last time the document was
                // synchronized, not the last time it was recycled.
                existingDocument.deltas = deltas;
                this.serverPort?.postMessage(rpc.createRequest(
                    'textDocument/didChange', {
                        textDocument: {
                            uri: 'file:///c:/Users/Connor/Desktop/clarity/src/markup_generator.ts',
                            version: existingDocument.version++
                        },
                        contentChanges: deltas
                    },
                    requestId
                ));
            } else {
                // If the document does not exist, the client will open it to be helpful to the source editor.
                // This is technically not conformant to LSP, but is a nice convenience for the user in some circumstances.
                this.openDocument(uri, '');
            }

            await promise;
        }
    }

    private async invalidate(uri: string, sourceCode: string): Promise<void> {
        const now = new Date();
        const delta = this.database.lastSynchronized ? now.getTime() - this.database.lastSynchronized.getTime() : 0;
        const requestId = crypto.randomUUID();
        if (!this.database.lastSynchronized || delta > 1500) {
            postMessage(
                `synchronizing symbol database... (${delta}ms since last refresh)`
            );

            const errorMessage = 'Timeout waiting for invalidate() response';
            const promise = new Promise<void>((resolve, reject) => {
                const timeout = window.setTimeout(() => {
                    this.promises.delete(requestId);
                    postMessage({
                        type: 'error',
                        message: errorMessage
                    });
                    reject(new Error(errorMessage));
                }, LanguageClient.REQUEST_TIMEOUT);
                this.promises.set(requestId, { resolve, reject, timeout });
            });

            this.serverPort?.postMessage(rpc.createRequest(
                'textDocument/didSave', {
                    textDocument: {
                        uri: uri,
                    },
                    text: sourceCode,
                },
                requestId,
            ));

            await promise;
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
