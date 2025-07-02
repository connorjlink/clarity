import fs from 'fs';
import ws from 'ws';
import url from 'url';
import http from 'http';
import path from 'path';
import uuid from 'uuid';

import * as rpc from '../common/jsonrpc';
import * as lsp from '../common/lsp';

import * as doc from './document';

const server = http.createServer();
const wss = new ws.Server({ noServer: true });

const jsonFilePath = path.join(__dirname, 'clarity-db.json');
var fileData: string | null = '';

var documentManager = new doc.DocumentManager();

async function readFileByUri(fileUri: string): Promise<string> {
    try {
        const filePath = fileURLToPath(fileUri);
        const data = await readFile(filePath, 'utf-8');
        return data;
    } catch (err) {
        throw new Error(`Failed to read file from URI: ${err}`);
    }
}

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
        console.log(`error reading database file ${jsonFilePath}`);
        return;
    }
    fileData = data;
    console.log(`read database file ${jsonFilePath}`);
});

function guid(): string {
    return uuid.uuidv4();
}



function validateLanguage(languageId: string): boolean {
    const acceptableLanguages = ['haze', 'hazes', 'hazei'];
    return acceptableLanguages.includes(languageId);
}

function validateDocumentUri(request: rpc.JSONRPCRequest) {
    const uri = request.params.textDocument.uri;
    if (!uri || typeof uri !== 'string') {
        throw new Error(`Invalid document URI: ${uri}`);
    }
    if (!uri.startsWith('file://')) {
        throw new Error(`Unsupported URI scheme for document: ${uri}`);
    }
}

async function requestCompleteRefresh(uri: string, text: string) {
    throw new Error(`requestCompleteRefresh not implemented for uri: ${uri}`);
}

function publishDiagnostics(uri: string, text: string, version?: lsp.integer) {
    if (documentManager.hasDocument(uri)) {
        const doc = documentManager.getDocument(uri);

        wss.send(JSON.stringify(
            rpc.createRequest("textDocument/publishDiagnostics", {
                uri: uri,
                version: version,
                diagnostics: doc.diagnostics || []
            }, guid())));
    }
}

async function handleDidOpen(request: rpc.JSONRPCRequest) {
    const uri = request.params.textDocument.uri;
    const languageId = request.params.textDocument.languageId;
    const version = request.params.textDocument.version;
    const text = request.params.textDocument.text;

    if (!validateLanguage(languageId)) {
        ws.send(JSON.stringify(
            rpc.createErrorResponse(
                request.id, 
                rpc.JSONRPC_ERRORS.INVALID_PARAMS.code, 
                `Unsupported language: ${languageId}`
            )));
        return;
    }

    if (documentManager.hasDocument(uri)) {
        const existingDoc = documentManager.getDocument(uri);

        // non-null strengthened
        if (version > existingDoc!.version) {
            // update the existing document only if the client version is newer
            existingDoc!.version = version;
            await requestCompleteRefresh(uri, text);
            publishDiagnostics(uri, version, text);

        } else {
            

        }

    } else {
        // create a new document
        const newDoc = new doc.LSPDocument();
        newDoc.uri = uri;
        newDoc.version = version;

        documentManager.createDocument(uri, newDoc);
    }
}

function handleDidClose(request: rpc.JSONRPCRequest) {
    // purge the existig document information from the manager, clear diagnostics
}

function handleDidChange(request: rpc.JSONRPCRequest) {

}

function handleDidSave(request: rpc.JSONRPCRequest) {

}

wss.on('connection', function connection(ws) {
    
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

            case 'workspace/didChangeConfiguration': {
                // this should never arise in the Web context, but provide a meaningful error anyway
                sendMessageToClient(ws, lsp.MessageKind.Info, 'The client configuration has changed on disk. Please reload the editor to apply the new settings.');
            } break;

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

wss.on('error', function error(error) {
    // liason with the web assembly compiler process potentially
    console.error(`socket error: ${error.message}`);
})

server.on('upgrade', function upgrade(request, socket, head) {
    if (request.url === '/symboldb') {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

server.listen(8080, () => {
    console.log('haze language server hosting on ws://localhost:8080/symboldb');
});

function sendMessageToClient(ws: ws, kind: lsp.MessageKindType, message: string) {
    let response = rpc.createSuccessResponse()

}


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
