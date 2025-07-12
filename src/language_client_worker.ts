
import * as lc from './language_client';
import * as sd from './symbol_database';

let serverPort: MessagePort | null = null;
let languageClient: lc.LanguageClient | null = null;

self.onmessage = (event) => {
    if (event.data?.type === 'connect' && event.data.port) {
        serverPort = event.data.port;
        if (serverPort) {
            serverPort.onmessage = (e) => {
                // route messages from the language server to the client port
                languageClient?.onMessage(e.data);
            };
            serverPort.onmessageerror = (e) => {
                // route message errors from the language server to the client port
                console.error('language client message receive error:', e);
                languageClient?.onError(e.data);
            };
        }
        // NOTE: choosing not to the client that the server is ready, since this is implied if the server
        // responds successfully to the initialize and initialized requests from the client.
        //clientPort.postMessage({ type: 'ready' });
    } else if (event.data?.type === 'execute') {
        const method = event.data.method;
        const params = event.data.params;
        if (languageClient && method && params) {
            languageClient.execute(method, params);
            

        } else {
            console.error('invalid client execute method request:', event.data);
        }
    }
};

var symbolDatabase = new sd.SymbolDatabase();
languageClient = new lc.LanguageClient(symbolDatabase, serverPort);

/*

// TODO: more research; used for function signatures
textDocument/signatureHelp

// for future real async use only
$/cancelRequest

*/
