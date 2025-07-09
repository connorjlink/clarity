import * as lsp from './LSP';
import * as rpc from './JSONRPC';
import * as ls from './language_server';
import * as sb from './symbol_database';
import * as cd from './compiler_driver';

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



export class LanguageClient {

    private database: sb.SymbolDatabase;
    private languageServer: ls.LanguageServer;
    private previous: {
        sourceCode: string;
        markup: string;
    };

    constructor(database: sb.SymbolDatabase) {
        this.database = database;
        this.previous = {
            sourceCode: '',
            markup: ''
        };
    }

    // ui connection
    public requestFileDialog(targetElement: HTMLElement): void {
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
                    targetElement.innerHTML = this.handleGenerateRequest(content);
                };
                reader.readAsText(files[0]);
            }
        };
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    public handleGenerateRequest(sourceCode: string, ): string {
        // short circuits over length comparison :)
        if (this.previous.sourceCode !== sourceCode) {
            this.invalidate(sourceCode);
            postMessage({
                destination: 'client',
                type: 'output',
                content: 'markup cache invalidation complete',
            });
        }

        return this.previous.markup;
    }

    public refresh(): void {
        this.invalidate(this.previous.sourceCode);
    }

    private invalidate(sourceCode: string, fullRefresh: boolean): void {
        this.previous.sourceCode = sourceCode;
        const now = new Date();
        const delta = this.database.lastSynchronized ? now.getTime() - this.database.lastSynchronized.getTime() : 0;
        if (!this.database.lastSynchronized || delta > 1500) {
            // throttle database updates to minimum 1.5 seconds because of compiler overhead
            postMessage({
                destination: 'client',
                type: 'output',
                content: `synchronizing symbol database... (${delta}ms since last refresh)`
            });

            // invalidate all of the source code and invoke the compiler for a complete re-processing
            if (fullRefresh) {
                postMessage({
                    destination: 'server',
                    type: 'request',
                    content: rpc.createRequest(
                        'textDocument/didSave', 
                        {
                            textDocument: {
                                uri: 'file:///c:/Users/Connor/Desktop/clarity/src/markup_generator.ts',
                            },
                            text: sourceCode,
                        },
                        crypto.randomUUID()
                    ) 
                });

            // post an incremental update; the language server will compute deltas and only call the compiler as necessary
            } else {
                postMessage({
                    destination: 'server',
                    type: 'request',
                    content: rpc.createRequest(
                        'textDocument/didChange', 
                        {
                            textDocument: {
                                uri: 'file:///c:/Users/Connor/Desktop/clarity/src/markup_generator.ts',
                                version: 1 // TODO: increment this properly 
                            }
                        },
                        crypto.randomUUID()
                    )
                });

                this.languageServer.documentManager.getDocument()
            }
        }
        this.previous.markup = this.generateMarkup(sourceCode);
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
                const symbol = this.symbolDatabase.lookup(token.text, token.line, token.column);
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
