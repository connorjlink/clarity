import * as lc from './LSPClient';
import * as sd from './SymbolDatabase';

let serverPort: MessagePort | null = null;
let languageClient: lc.LanguageClient | null = null;

self.onmessage = (event) => {
    if (event.data?.type === 'connect' && event.data.port) {
        serverPort = event.data.port;
        
        let symbolDatabase = new sd.SymbolDatabase();
        languageClient = new lc.LanguageClient(symbolDatabase, serverPort);

        if (serverPort) {
            serverPort.onmessage = (error) => {
                // route messages from the language server to the client port
                languageClient?.onMessage(error);
            };
            serverPort.onmessageerror = (error) => {
                // route parceled message errors from the language server to the client port
                console.error('language client message receive error:', error);
                languageClient?.onMessageError(error);
            };
        }
        // notify the UI that the client is connected and good to go, adding a log description
        self.postMessage({ type: 'ready', status: 'connected', message: 'Worker message port successfully bound.' });
    } else if (event.data?.type === 'execute') {
        const method = event.data.method;
        const params = event.data.params;
        if (languageClient && method && params) {
            languageClient.execute(method, ...Object.values(params));
            
        } else {
            const errorMsg = `invalid client execute method request: ${JSON.stringify(event.data)}`;
            console.error(errorMsg);
            self.postMessage({ type: 'error', message: errorMsg });
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
