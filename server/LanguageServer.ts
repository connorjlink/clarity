import * as ws from 'ws';
import {v4 as uuidv4} from 'uuid';

import * as rpc from '../common/JSONRPC';
import * as lsp from '../common/LSP';
import * as doc from './LSPDocument';

type MethodNames = Exclude<{
    [K in keyof LanguageServer]: LanguageServer[K] extends Function ? K : never }[keyof LanguageServer],
    'execute'
>

export class LanguageServer {
    private documentManager: doc.DocumentManager = new doc.DocumentManager();
    private hasInitialized: boolean = false;
    private hasShutdown: boolean = false;

    // dynamic dispatch for onMessage callbacks
    execute(key: MethodNames, ...args: any[]) {
        const property = (this as any)[key];
        if (typeof property === 'function') {
            // property is a valid function
            return property.apply(this, args);
        }
        throw new Error(`Method \"${key}\" does not exist on type LanguageServer`);
    }

    // NOTE: parent must call to register handlers with the correct WebSocket route first!
    getHandlers() {
        return {
            onOpen: this.onOpen.bind(this),
            onMessage: this.onMessage.bind(this),
            onClose: this.onClose.bind(this),
            onError: this.onError.bind(this),
        };
    }

    onOpen(ws: ws.WebSocket) {
        console.log('clarity haze language server socket opened');
    }

    async onMessage(ws: ws.WebSocket, message: ws.RawData) {
        try {
            var request: rpc.JSONRPCRequest = JSON.parse(message.toString());

            if (!this.hasInitialized) {
                // the server should exlicitly error requests but ignore notifications
                if (request.id) {
                    ws.send(JSON.stringify(
                        rpc.createErrorResponse(
                            request.id, 
                            rpc.JSONRPC_ERRORS.SERVER_NOT_INITIALIZED.code, 
                            rpc.JSONRPC_ERRORS.SERVER_NOT_INITIALIZED.message
                        )));
                }
                return;
            }

            try {
                // dynamically dispatch the request handler
                const method = request.method.replace('/', '_');
                const key = method as MethodNames;
                this.execute(key, ws, request);

            } catch (error) {
                // invalid method (or not supported by the server)
                ws.send(JSON.stringify(
                    rpc.createErrorResponse(
                        request.id || null, // null for notifications, specified Id for requests
                        rpc.JSONRPC_ERRORS.METHOD_NOT_FOUND.code, 
                        rpc.JSONRPC_ERRORS.METHOD_NOT_FOUND.message + `: ${request.method}`
                    )));
            }

        } catch (error) {
            // generic JSONRPC parse error
            ws.send(JSON.stringify(
                rpc.createErrorResponse(
                    null,  // null id for fully invalid request per JSONRPC spec
                    rpc.JSONRPC_ERRORS.PARSE_ERROR.code, 
                    rpc.JSONRPC_ERRORS.PARSE_ERROR.message
                )));
        }
    }

    onClose(ws: ws.WebSocket) {
        console.log('clarity haze language server socket closed');
    }

    onError(ws: ws.WebSocket, error: Error) {
        console.error('clarity haze language server socket error:', error);
    }

    /////////////////////////////////////////////////////////

    private async initialize(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        // the client has initialized, now the server can register capabilities
        ws.send(JSON.stringify(
            rpc.createSuccessResponse(request.id, {
                capabilities: {
                    textDocumentSync: lsp.TextDocumentSyncKind.Incremental,
                    definitionProvider: true,
                    typeDefinitionProvider: true,
                    hoverProvider: true,
                    completionProvider: {
                        resolveProvider: true,
                        triggerCharacters: ['.', '(', '[', '{'],
                    },
                    documentSymbolProvider: true,
                    documentHighlightProvider: true,
                    semanticTokensProvider: {
                        legend: {
                            // all token types for now
                            tokenTypes: [
                                'file', 'module', 'namespace', 'package',
                                'class', 'method', 'property', 'field', 'constructor',
                                'enum', 'interface', 'function', 'variable',
                                'constant', 'string', 'number', 'boolean',
                                'array', 'object', 'key', 'null', 'enumMember',
                                'struct', 'event', 'operator', 'typeParameter'
                            ],
                            tokenModifiers: [
                                'signed', 'unsigned', 'mutable', 'immutable', 
                                'value', 'ptr', 'nvr', 'struct', 'string',
                                'qword', 'dword', 'word', 'byte'
                            ],
                        },
                        // for now, synchronize semantic tokens completely to avoid having
                        // to compute deltas!
                        full: true,
                    },
                    workspaceSymbolProvider: true,
                }
            })));
    }
    
    private async initialized(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        this.hasInitialized = true;
    }

    private async shutdown(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        // the client has requested a shutdown, the server should respond with success
        this.hasShutdown = true;
        ws.send(JSON.stringify(
            rpc.createSuccessResponse(request.id, null)
        ));
    }

    private async exit(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        ws.close();
        if (this.hasShutdown) {
            throw new Error('Exit Code 0: OK');
        }
        throw new Error('Exit Code 1: Not Shut Down');
    }

    private async textDocument_didOpen(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument.uri;
        const languageId = request.params.textDocument.languageId;
        const version = request.params.textDocument.version;
        const text = request.params.textDocument.text;

        // for simplicity, the language server ONLY checks the URI and document language upon opening
         
        if (!LanguageServer.validateDocumentUri(request)) {
            ws.send(JSON.stringify(
                rpc.createErrorResponse(
                    request.id, 
                    rpc.JSONRPC_ERRORS.INVALID_PARAMS.code, 
                    `Invalid document URI: ${uri}`
                )));
            return;
        }

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
            const newDocument = new doc.LSPDocument(uri, languageId, version);
            newDocument.lines = text.split('\n');
            // clears the symbols and diagnostics to empty
            newDocument.invalidateSymbols();
            this.documentManager.createDocument(uri, newDocument);
            await this.requestCompleteRefresh(ws, uri, newDocument.lines);
        }

        // always the server's responsibility to report diagnostic data
        this.publishDiagnostics(ws, uri, this.documentManager.getDocument(uri)?.lines.join('\n') ?? '', version);
    }

    private textDocument_didChange(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
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
                lines = existingDocument.applyTextEdit(lines, change.range, change.text);
            } else {
                // Full change: replace the whole text
                lines = change.text.split('\n');
            }
        }

        existingDocument.lines = lines;
        existingDocument.version = version;

        this.requestCompleteRefresh(ws, uri, lines);
    }

    private textDocument_didClose(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        // retains symbol and diagnostic data because the server must continue to 
        // be able to respond to symbol and diagnostic requests
        const uri = request.params.textDocument.uri;
        const existingDocument = this.documentManager.getDocument(uri);
        if (existingDocument) {
            // purge document text only, will refresh upon re-open
            existingDocument.lines = [];
        }
    }

    private textDocument_didSave(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
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

    private textDocument_didChangeConfiguration(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        // this should never arise in the Web context, but provide a meaningful error anyway
        this.sendMessageToClient(ws, lsp.MessageKind.Info, 'The client configuration has changed on disk. Please reload the editor to apply the new settings.');
    }

    private textDocument_didChangeWatchedFiles(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        // this should never arise in the Web context, but provide a meaningful error anyway
        this.sendMessageToClient(ws, lsp.MessageKind.Info, 'One or more workspace files has been changed on disk. Please reload the document to prevent a loss of data.');
    }

    private textDocument_hover(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument;
        const position = request.params.position;

        const existingDocument = this.documentManager.getDocument(uri);
        if (!existingDocument) {
            this.uriDoesNotExist(ws, uri, request.id);
            return;
        }

        const hoveredSymbol = existingDocument.getSymbolAroundPosition(position);
        if (hoveredSymbol) {
            ws.send(JSON.stringify(
                rpc.createSuccessResponse(request.id, {
                    contents: hoveredSymbol.name,
                    range: hoveredSymbol.location.range
                })
            ));
        } else {
            ws.send(JSON.stringify(
                rpc.createSuccessResponse(request.id, null)
            ));
        }
    }

    // Document-specific symbol search. Requires valid document identification.
    private textDocument_documentSymbol(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument.uri;

        const existingDocument = this.documentManager.getDocument(uri);
        if (!existingDocument) {
            this.uriDoesNotExist(ws, uri, request.id);
            return;
        }

        const symbols = existingDocument?.getAllSymbols();

        ws.send(JSON.stringify(
            rpc.createSuccessResponse(request.id, symbols)
        ));
    }

    // Project-wide symbol search. Does not require a specific document URI.
    private workspace_symbol(ws: ws.WebSocket, request: rpc.JSONRPCRequest) {
        const query = request.params.query;
        const queryResult: lsp.WorkspaceSymbol[] = [];
        
        for (const [uri, doc] of this.documentManager.zipAllDocuments()) {
            for (const symbol of doc.getAllSymbols()) {
                // empty == every symbol, otherwise LIKE (case-sensitive)
                if (query === "" || symbol.name.includes(query)) {
                    queryResult.push(symbol);
                }
            }
        }
    
        ws.send(JSON.stringify(
            rpc.createSuccessResponse(request.id, queryResult)
        ));
    }

    /////////////////////////////////////////////////////////

    private publishDiagnostics(ws: ws.WebSocket, uri: string, text: string, version?: lsp.integer, requestId?: rpc.JSONRPCID) {
        const existingDocument = this.documentManager.getDocument(uri);
        if (!existingDocument) {
            this.uriDoesNotExist(ws, uri, requestId)
            return;
        }

        ws.send(JSON.stringify(
            rpc.createRequest("textDocument/publishDiagnostics", {
                uri: uri,
                version: version,
                diagnostics: existingDocument.getDiagnostics() || []
            }, uuidv4())));
    }
    
    private async requestCompleteRefresh(ws: ws.WebSocket, uri: string, linesOptional?: string[], requestId?: rpc.JSONRPCID) {
        let lines = linesOptional;
        if (!lines) {
            const existingDocument = this.documentManager.getDocument(uri);
            if (!existingDocument) {
                this.uriDoesNotExist(ws, uri, requestId);
                return;
            }
            lines = existingDocument.lines;
        }

        // TODO: invoke the compiler driver to perform a full AST rebuild
        // AND inject the new symbols and diagnostics into the DocumentManager-managed document
        this.publishDiagnostics(ws, uri, lines.join('\n'));
    }
    
    private sendMessageToClient(ws: ws.WebSocket, kind: lsp.MessageKindType, message: string) {
        ws.send(JSON.stringify(
            rpc.createRequest("window/showMessage", {
                type: kind,
                message: message
                // not support action items for now
            }, uuidv4())));
    }

    private uriDoesNotExist(ws: ws.WebSocket, uri: string, requestId?: rpc.JSONRPCID) {
        ws.send(JSON.stringify(
            rpc.createErrorResponse(
                requestId || null,
                rpc.JSONRPC_ERRORS.INVALID_PARAMS.code, 
                rpc.JSONRPC_ERRORS.INVALID_PARAMS.message + `Document with URI ${uri} not found`
            )));
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