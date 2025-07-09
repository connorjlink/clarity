import * as ls from './language_server';
import * as mg from './markup_generator';
import * as cd from './compiler_driver';

var languageServer = new ls.LanguageServer();
var compilerDriver = new cd.CompilerDriver();
var markupGenerator = new mg.MarkupGenerator();

// main-thead communication

onmessage = (event: MessageEvent) => {
    const data = event.data;

}

onmessageerror = (event: MessageEvent) => {
    console.error('Message error:', event.data);

}

onerror = (error: ErrorEvent) => {
    console.error('Worker error:', error);

}



/*

// TODO: more research; used for function signatures
textDocument/signatureHelp

// for future real async use only
$/cancelRequest

*/
