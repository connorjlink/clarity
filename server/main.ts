import * as ws from 'ws';

import * as rpc from '../common/JSONRPC';
import * as lsp from '../common/LSP';
import * as sr from './SocketRouter';
import * as ls from './LanguageServer';

var languageServer = new ls.LanguageServer();

// running on development port for now
const router = new sr.SocketRouter(8080);

// websocket connection with the LSP client
router.attachEndpoint('/clarity-client', languageServer.getHandlers());

// websocket connection with the compiler
router.attachEndpoint('/compiler', {
    onOpen: (ws: ws.WebSocket) => {
        console.log('clarity compiler socket opened');  
    },
    onMessage: (ws: ws.WebSocket, message: ws.RawData) => {
        const result = JSON.parse(message.toString());
        if (result.symbol) {

        }
    },
    onClose: (ws: ws.WebSocket) => {
        console.log('clarity compiler server socket closed');
    },
    onError: (ws: ws.WebSocket, error: Error) => {
        console.error('clarity compiler server socket error:', error);
    }
});


wss.on('message', function message(data) {
    try {
        var request: rpc.JSONRPCRequest  = JSON.parse(data.toString());

        switch (request.method) {
            case 'initialize': {
                // TODO:
            } break;

            case 'initialized': {
                // TODO:  register capatilbities with the client
                // client/registerCapability
            } break;

            case 'shutdown': {
                ws.send(JSON.stringify(
                    rpc.createSuccessResponse(request.id, null)
                ));
            }
            // fallthrough
            case 'exit': {
                wss.close();
                server.close();
            } break;

            case '$/cancelRequest': {
                const cancelId = request.params.id;
                // TODO: implement cancellation logic for this request as needed
                // probably would need a queuing system--each incoming message enqueues the request
                // and a worker(s) could dequeue to process and respond. this would simply erase the corresponding request from that queue
            } break;

            case 'textDocument/didOpen': {
                validateDocumentUri(request);
                handleDidOpen(request);
            } break;

            case 'textDocument/didClose': {
                handleDidClose(request);
            } break;

            case 'textDocument/didChange': {
                handleDidChange(request);
            } break;

            case 'textDocument/didSave': {
                handleDidSave(request);
            } break;

            // notification
            case 'workspace/didChangeConfiguration': {
                // this should never arise in the Web context, but provide a meaningful error anyway
                sendMessageToClient(ws, lsp.MessageKind.Info, 'The client configuration has changed on disk. Please reload the editor to apply the new settings.');
            } break;

            // notification
            case 'workspace/didChangeWatchedFiles': {
                // this should never arise in the Web context, but provide a meaningful error anyway
                sendMessageToClient(ws, lsp.MessageKind.Info, 'One or more workspace files has been changed on disk. Please reload the document to prevent a loss of data.');
            } break;

            case 'textDocument/hover': {

            } break;

            case 'textDocument/documentSymbol': {
                const uri = request.params.textDocument.uri;

                if (!documentManager.hasDocument(uri)) {
                    ws.send(JSON.stringify(
                        rpc.createErrorResponse(
                            request.id, 
                            rpc.JSONRPC_ERRORS.INVALID_PARAMS.code, 
                            `Document with URI ${uri} not found`
                        )));
                    return;

                } else {
                    const doc = documentManager.getDocument(uri);
                    const symbols = doc.symbols || [];

                    ws.send(JSON.stringify(
                        rpc.createSuccessResponse(request.id, symbols)
                    ));
                }

            } break;

            case 'workspace/symbol': {
                const query = request.params.query;
                const queryResult: lsp.WorkspaceSymbol[] = [];

                for (const [uri, doc] of documentManager.zipAllDocuments()) {
                    if (doc.symbols) {
                        for (const symbol of doc.symbols) {
                            // empty == every symbol, otherwise LIKE (case-sensitive)
                            if (query === "" || symbol.name.includes(query)) {
                                queryResult.push(symbol);
                            }
                        }
                    }
                }

                wss.send(JSON.stringify(
                    rpc.createSuccessResponse(request.id, queryResult)
                ));

            } break;

        }

    } catch (e) {
        // generic JSONRPC parse error
        ws.send(JSON.stringify(
            rpc.createErrorResponse(
                null,  // null id for fully invalid request per JSONRPC spec
                rpc.JSONRPC_ERRORS.PARSE_ERROR.code, 
                rpc.JSONRPC_ERRORS.PARSE_ERROR.message
            )));
    }
});



// listen for textDocument/didOpen to request a full new symbol set per the new file
// listen for textDocument/completion to request suggestions for the current symbol
// textDocument/hover to request information about the hovered symbol
// textDocument/diagnostic

/*

NAME (SUPPORTED IN VISUAL STUDIO 2022)

WILL SUPPORT IN SERVER 
initialize 	                    yes
initialized 	                yes
shutdown 	                    yes
exit 	                        yes
$/cancelRequest 	            yes 
workspace/didChangeWatchedFiles yes
workspace/didChangeWatchedFiles yes
textDocument/didOpen 	        yes
textDocument/didChange 	        yes
textDocument/didSave            yes
textDocument/didClose           yes
textDocument/publishDiagnostics yes
workspace/symbol                yes


STILL TO ADD YET:!

window/showMessage 	            yes
window/logMessage 	            yes

textDocument/definition 	yes

// both should be similar!
textDocument/documentHighlight 	yes
textDocument/references 	yes

textDocument/completion 	yes
 	yes

// need to read more about this one, used for function signatures
textDocument/signatureHelp 	yes

*/
