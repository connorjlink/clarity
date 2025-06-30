import fs from 'fs';
import ws from 'ws';
import http from 'http';
import path from 'path';

import * as lsp from '../common/jsonrpc';

const server = http.createServer();
const wss = new ws.Server({ noServer: true });

const jsonFilePath = path.join(__dirname, 'clarity-db.json');
var fileData: string | null = '';

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
        console.log(`error reading database file ${jsonFilePath}`);
        return;
    }
    fileData = data;
    console.log(`read database file ${jsonFilePath}`);
});

wss.on('connection', function connection(ws) {
    
});

wss.on('message', function message(data) {
    try {
        var request: lsp.JSONRPCRequest  = JSON.parse(data.toString());

    } catch (e) {
        // generic JSONRPC parse error
        ws.send(JSON.stringify(
            lsp.createErrorResponse(
                null, 
                lsp.JSONRPC_ERRORS.PARSE_ERROR.code, 
                lsp.JSONRPC_ERRORS.PARSE_ERROR.message
            )));
    }
    //ws.send(data, () => {
    //    console.log(`sent db package to client`);
    //});
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

// listen for textDocument/didOpen to request a full new symbol set per the new file
// listen for textDocument/completion to request suggestions for the current symbol
// textDocument/hover to request information about the hovered symbol
// textDocument/diagnostic

/*

Message 	Has Support in Visual Studio
initialize 	yes
initialized 	yes
shutdown 	yes
exit 	yes
$/cancelRequest 	yes
window/showMessage 	yes
window/showMessageRequest 	yes
window/logMessage 	yes
telemetry/event 	
client/registerCapability 	
client/unregisterCapability 	
workspace/didChangeConfiguration 	yes
workspace/didChangeWatchedFiles 	yes
workspace/symbol 	yes
workspace/executeCommand 	yes
workspace/applyEdit 	yes
textDocument/publishDiagnostics 	yes
textDocument/didOpen 	yes
textDocument/didChange 	yes
textDocument/willSave 	
textDocument/willSaveWaitUntil 	
textDocument/didSave 	yes
textDocument/didClose 	yes
textDocument/completion 	yes
completion/resolve 	yes
textDocument/hover 	yes
textDocument/signatureHelp 	yes
textDocument/references 	yes
textDocument/documentHighlight 	yes
textDocument/documentSymbol 	yes
textDocument/formatting 	yes
textDocument/rangeFormatting 	yes
textDocument/onTypeFormatting 	
textDocument/definition 	yes
textDocument/codeAction 	yes


textDocument/rename 	yes


NOT 100% STANDARD. DO NOT IMPLEMENt
textDocument/codeLens 	
codeLens/resolve 	
textDocument/documentLink 	
documentLink/resolve 	

*/
