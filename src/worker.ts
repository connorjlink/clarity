import * as ls from './language_server';
import * as lc from './language_client';
import * as cd from './compiler_driver';
import * as sd from './symbol_database';
import * as doc from './LSP_document';

const HOST = 'localhost';
const PORT = '8080';

var compilerDriver = new cd.CompilerDriver(HOST, PORT);
var symbolDatabase = new sd.SymbolDatabase();
var documentManager = new doc.DocumentManager();
var languageClient = new lc.LanguageClient(symbolDatabase);
var languageServer = new ls.LanguageServer();

languageServer.injectDependencies(compilerDriver, documentManager);
compilerDriver.injectDependencies(languageClient, languageServer);

// main-thead communication

self.onmessage = (event: MessageEvent) => {
    const data = event.data;

}

self.onmessageerror = (event: MessageEvent) => {
    console.error('Message error:', event.data);
}

self.onerror = (error: any) => {
    console.error('Worker error:', error.toString());
}

/*

// TODO: more research; used for function signatures
textDocument/signatureHelp

// for future real async use only
$/cancelRequest

*/
