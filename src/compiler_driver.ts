import * as ls from './language_server';
import * as doc from './LSP_document';
import * as lsp from './LSP';

export class CompilerDriver {

    private pendingRequestResolve: (() => void) | null = null;
    private ws: WebSocket | null = null;

    // NOTE: parent must dynamically dependency inject!
    private languageServer: ls.LanguageServer | null = null;

    injectDependencies(languageServer: ls.LanguageServer) {
        this.languageServer = languageServer;
    }

    constructor(host: string, port: string) {
        this.ws = new WebSocket(`ws://${host}:${port}`);

        this.ws.onopen = () => this.onOpen(this.ws!);
        this.ws.onmessage = (event) => this.onMessage(this.ws!, event.data);
        this.ws.onclose = () => this.onClose(this.ws!);
        this.ws.onerror = (error) => this.onError(this.ws!, error);
    }

    /////////////////////////////////////////////////////////

    send(data: any) {
        this.ws?.send(JSON.stringify(data));
    }

    /////////////////////////////////////////////////////////

    onOpen(ws: WebSocket) {
        this.languageServer?.logMessage(`clarity compiler server socket opened`, lsp.MessageKind.Log);
        this.ws = ws;
    }

    onMessage(ws: WebSocket, message: any) {
        try {
            const result = JSON.parse(message.toString());
            // specifies that the compiler has completed the active job
            if (result.done) {
                // notify the work submitter that the work is complete
                // NOTE: the language server itself will handle publishing diagnostics appropriately
                this.pendingRequestResolve?.();
                this.pendingRequestResolve = null;
            }
            // specifies that the compiler has sent symbol information
            else if (result.symbol) {
                // NOTE: the language server itself will handle translating and serving symbol information
                const symbol: doc.HazeSymbol = result.symbol;
                const uri = symbol.location.filepath;
                this.languageServer?.dispatchSymbol(uri, symbol);
            } 
            // specifies that the compiler has sent internal statistics information (like memory usage, object instantiations)
            else if (result.statistic) {
                // TODO: probably just pass through to the client since this can be a custom message (perhaps hazeCompiler/statistic)
                const statistic = result.statistic;

            }
            // specifies that the compiler has sent a diagnostic message
            else if (result.diagnostic) {
                // NOTE: requires that the compiler send diagnostics in LSP format
                const diagnostic: lsp.Diagnostic = {
                    range: {
                        start: { 
                            line: result.diagnostic.startLine, 
                            character: result.diagnostic.startColumn 
                        },
                        end: { 
                            line: result.diagnostic.endLine,
                            character: result.diagnostic.endColumn
                        }
                    },
                    severity: result.diagnostic.severity,
                    code: result.diagnostic.code,
                    codeDescription: result.diagnostic.codeDescription ? { href: result.diagnostic.codeDescription.href } : undefined,
                    source: 'haze compiler',
                    message: result.diagnostic.message
                }

                const uri = result.diagnostic.filepath;
                this.languageServer?.dispatchDiagnostic(uri, diagnostic);
            }
            // specifies that the compiler has sent a textual message
            else if (result.message) {
                // notify the language server of the requested message
                // NOTE: this does not provide a direct means by which to display a windowed message. the language server handles this alone.
                const messageText = result.message.text;
                const messageKind = result.message.kind || lsp.MessageKind.Log; // default to log if not specified
                this.languageServer?.logMessage(messageText, messageKind);
            }

        } catch (error) {
            this.languageServer?.logMessage(`clarity compiler server socket error parsing message: ${error}`, lsp.MessageKind.Error);
        }
    }

    onClose(ws: WebSocket) {
        this.languageServer?.logMessage(`clarity compiler server socket closed`, lsp.MessageKind.Log);
    }

    onError(ws: WebSocket, error: Event) {
        this.languageServer?.logMessage(`clarity compiler server socket error: ${error}`, lsp.MessageKind.Error);
    }

    /////////////////////////////////////////////////////////

    private checkNonNull() {
        if (!this.ws) {
            this.languageServer?.logMessage(`clarity compiler server socket error: ws was null`, lsp.MessageKind.Error);
            return false;
        }
        return true;
    }

    private logMessage(message: string): void {
        if (this.languageServer) {
            this.languageServer.logMessage(message);
        }
    }

    private async submitRequest(request: any): Promise<void> {
        if (!this.checkNonNull()) {
            return;
        }

        const donePromise = new Promise<void>((resolve) => {
            this.pendingRequestResolve = resolve;
        });

        try {
            const message = JSON.stringify(request);
            // non-null strengthened
            this.ws!.send(message);
        } catch (error) {
            this.languageServer?.logMessage(`clarity compiler server socket error submitting work request: ${error}`, lsp.MessageKind.Error);
        }

        // pause here until the compiler responds. since this is async, it will not block the web worker.
        await donePromise;
    }

    async requestCompile(lines: string[]): Promise<void> {
        if (!this.checkNonNull()) {
            return;
        }

        const request = {
            type: 'compile',
            text: lines.join('\n'),
        };

        await this.submitRequest(request);
    }
}