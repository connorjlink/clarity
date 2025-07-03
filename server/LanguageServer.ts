import * as ws from 'ws';
import {v4 as uuidv4} from 'uuid';

import * as rpc from '../common/JSONRPC.ts';
import * as lsp from '../common/LSP.ts';
import * as router from './SocketRouter.ts';
import * as doc from './DocumentManager.ts';

export class LanguageServer {
    private documentManager: doc.DocumentManager = new doc.DocumentManager();

    constructor(router: router.SocketRouter) {
        router.attachEndpoint('/languageserver', {
            onOpen: this.onOpen,
            onMessage: this.onMessage,
            onClose: this.onClose,
            onError: this.onError,
        });
    }

    onOpen(ws: WebSocket) {
        console.log('clarity haze language server socket opened');
    }

    async onMessage(ws: WebSocket, message: ws.RawData) {
       
    }

    onClose(ws: WebSocket) {
        console.log('clarity haze language server socket closed');
    }

    onError(ws: WebSocket, error: Error) {
        console.error('clarity haze language server socket error:', error);
    }

    /////////////////////////////////////////////////////////

    /* LSP Document Synchronziation Functions */

    private async didOpen(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument.uri;
        const languageId = request.params.textDocument.languageId;
        const version = request.params.textDocument.version;
        const text = request.params.textDocument.text;

        if (!LanguageServer.validateLanguage(languageId)) {
            ws.send(JSON.stringify(
                rpc.createErrorResponse(
                    request.id, 
                    rpc.JSONRPC_ERRORS.INVALID_PARAMS.code, 
                    `Unsupported language: ${languageId}`
                )));
            return;
        }

        const existingDocument = this.documentManager.getDocument(uri);
        if (existingDocument) {
            // update the existing document only if the client version is newer
            if (version > existingDocument.version) {
                existingDocument.version = version;
                existingDocument.lines = text.split('\n');
                await this.requestCompleteRefresh(ws, uri, existingDocument.lines);
            }
        } else {
            // did not exist, create a new document
            const newDocument = new doc.LSPDocument();
            newDocument.uri = uri;
            newDocument.languageId = languageId;
            newDocument.version = version;
            newDocument.lines = text.split('\n');
            newDocument.symbols = [];
            newDocument.diagnostics = [];
            this.documentManager.createDocument(uri, newDocument);
            await this.requestCompleteRefresh(ws, uri, newDocument.lines);
        }

        // always the server's responsibility to report diagnostic data
        this.publishDiagnostics(ws, uri, this.documentManager.getDocument(uri)?.lines.join('\n') ?? '', version);
    }

    private didChange(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument.uri;
        const version = request.params.textDocument.version;
        const contentChanges = request.params.contentChanges;

        const existingDocument = this.documentManager.getDocument(uri);
        if (!existingDocument) {
            // document does not exist, cannot change it
            return;
        }

        if (version <= existingDocument.version) {
            // client is sending an older version, ignore
            return;
        }

        let lines = existingDocument.lines ?? [];

        for (const change of contentChanges) {
            if (change.range) {
                lines = applyTextEdit(lines, change.range, change.text);
            } else {
                // Full change: replace the whole text
                lines = change.text.split('\n');
            }
        }

        existingDocument.lines = lines;
        existingDocument.version = version;

        this.requestCompleteRefresh(ws, uri, lines);
    }

    private didClose(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        // retains symbol and diagnostic data because the server must continue to 
        // be able to respond to symbol and diagnostic requests
        const uri = request.params.textDocument.uri;
        const existingDocument = this.documentManager.getDocument(uri);
        if (existingDocument) {
            // purge document text only, will refresh upon re-open
            existingDocument.lines = [];
        }
    }

    private didSave(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument.uri;

        let text: string | undefined = request.params.text;
        if (text) {
            // if the text is provided, it is the complete text of the document
            const existingDocument = this.documentManager.getDocument(uri);
            if (existingDocument) {
                existingDocument.lines = text.split('\n');
            }
        }

        // if the text is not provided, the server has to assume it has the latest version already

        const existingLines = this.documentManager.getDocument(uri)?.lines;
        if (existingLines) {
            this.requestCompleteRefresh(ws, uri, existingLines);
        }
    }

    /////////////////////////////////////////////////////////

    private publishDiagnostics(ws: ws.WebSocket, uri: string, text: string, version?: lsp.integer) {
        const existingDocument = this.documentManager.getDocument(uri);
        if (existingDocument) {
            ws.send(JSON.stringify(
                rpc.createRequest("textDocument/publishDiagnostics", {
                    uri: uri,
                    version: version,
                    diagnostics: existingDocument.diagnostics || []
                }, uuidv4())));
        }
    }
    
    private async requestCompleteRefresh(ws: ws.WebSocket, uri: string, linesOptional?: string[]) {
        let lines = linesOptional || this.documentManager.getDocument(uri)?.lines;
        if (lines) {
            // TODO: invoke the compiler driver to perform a full AST rebuild
            // AND inject the new symbols and diagnostics into the DocumentManager-managed document
            this.publishDiagnostics(ws, uri, lines.join('\n'));
        }
    }

    /////////////////////////////////////////////////////////

    private static validateLanguage(languageId: string): boolean {
        const acceptableLanguages = ['haze', 'hazes', 'hazei'];
        return acceptableLanguages.includes(languageId);
    }

    private static validateDocumentUri(request: rpc.JSONRPCRequest): boolean {
        const uri = request.params.textDocument.uri;
        if (!uri || typeof uri !== 'string') {
            return false;
        }
        if (!uri.startsWith('file://')) {
            return false;
        }
        return true;
    }    
}