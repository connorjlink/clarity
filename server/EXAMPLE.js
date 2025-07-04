const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log('Listening on en ws://localhost:8080');
});

wss.on('connection', (ws) => {
  console.log('Client connected');
  const interval = setInterval(() => {
    ws.send('Message from the server');
  }, 2000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});