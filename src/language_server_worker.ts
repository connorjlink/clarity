/// <reference lib="webworker" />
import * as ls from './language_server';
import * as cd from './compiler_driver';
import * as doc from './LSP_document';

const HOST = 'localhost';
const PORT = '8080';

var documentManager = new doc.DocumentManager();
var compilerDriver = new cd.CompilerDriver(HOST, PORT);
var languageServer = new ls.LanguageServer();

languageServer.injectDependencies(compilerDriver, documentManager);
compilerDriver.injectDependencies(languageServer);

let clientPort: MessagePort | null = null;

self.onmessage = (event) => {
    if (event.data?.type === 'connect' && event.data.port) {
        clientPort = event.data.port;
        if (clientPort) {
            clientPort.onmessage = (e) => {
                // route the language server messages to the client port
                languageServer.onMessage(clientPort as unknown as Worker, e.data);
            };
            clientPort.onmessageerror = (e) => {
                // route the language server message errors to the client port
                languageServer.onError(clientPort as unknown as Worker, e.data);
            }
        }
        // NOTE: choosing not to the client that the server is ready, since this is implied if the server
        // responds successfully to the initialize and initialized requests from the client.
        //clientPort.postMessage({ type: 'ready' });
    }
};

languageServer.onOpen({
    postMessage: (msg: any) => clientPort?.postMessage(msg)
} as unknown as Worker);
