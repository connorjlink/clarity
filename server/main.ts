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

/*

NAME (SUPPORTED IN VISUAL STUDIO 2022)

WILL SUPPORT IN SERVER 
initialize 	                    yes
initialized 	                yes
shutdown 	                    yes
exit 	                        yes
workspace/didChangeWatchedFiles yes
workspace/didChangeWatchedFiles yes
textDocument/didOpen 	        yes
textDocument/didChange 	        yes
textDocument/didSave            yes
textDocument/didClose           yes
textDocument/publishDiagnostics yes
workspace/symbol                yes
window/showMessage 	            yes
window/logMessage 	            yes
textDocument/definition 	    yes
textDocument/references 	    yes
textDocument/documentHighlight 	yes


STILL TO ADD YET:!



// both should be similar!

textDocument/completion 	yes
yes

// need to read more about this one, used for function signatures
textDocument/signatureHelp 	yes
$/cancelRequest 	            yes  ( FOR FUTURE REAL ASYNC USE ONLY )

*/
