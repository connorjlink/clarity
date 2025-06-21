const fs = require('fs');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

const jsonFilePath = path.join(__dirname, 'clarity-db.json'); // Cambia 'archivo.json' por el nombre de tu archivo

wss.on('connection', function connection(ws) {
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.log(`error reading database file ${jsonFilePath}`);
            ws.close();
            return;
        }
        ws.send(data, () => {
            console.log(`sent db package to client`);
            ws.close();
        });
    });
});

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
  console.log('ClarityDB hosting on ws://localhost:8080/symboldb');
});