import * as ls from './LSPServer';
import * as cd from './CompilerDriver';
import * as doc from './LSPDocument';

const HOST = 'localhost';
const PORT = '8080';

var documentManager = new doc.DocumentManager();

var compilerDriver = new cd.CompilerDriver(HOST, PORT);
var languageServer = new ls.LanguageServer();

languageServer.injectDependencies(compilerDriver, documentManager);
compilerDriver?.injectDependencies(languageServer);

let clientPort: MessagePort | null = null;

compilerDriver.onStatusChange = (status) => {
    self.postMessage({ 
        type: 'status', 
        status, 
        message: `Compiler driver status changed to '${status}'` 
    });
};

self.addEventListener('message', (event) => {
    if (event.data?.type === 'connect' && event.data.port) {
        clientPort = event.data.port;
        if (clientPort) {
            clientPort.addEventListener('message', (e) => {
                // route the language server messages to the client port
                languageServer.onMessage(clientPort as unknown as Worker, e.data);
            });
            clientPort.addEventListener('messageerror', (e) => {
                // route the language server message errors to the client port
                languageServer.onError(clientPort as unknown as Worker, e.data);
            });
            clientPort.start();
        }
    }
});

languageServer.onOpen({
    postMessage: (message: any) => clientPort?.postMessage(message)
} as unknown as Worker);
