import * as sr from './SocketRouter';
import * as ls from './LanguageServer';
import * as cd from './CompilerDriver';

var languageServer = new ls.LanguageServer();
var compilerDriver = new cd.CompilerDriver();

// running on development port for now
const router = new sr.SocketRouter(8080);

// websocket connection with the LSP client
router.attachEndpoint('/clarity-client', languageServer.getHandlers());

// websocket connection with the compiler
router.attachEndpoint('/compiler', compilerDriver.getHandlers());

/*

// need to read more about these, used for function signatures
textDocument/signatureHelp

// for future real async use only
$/cancelRequest

*/
