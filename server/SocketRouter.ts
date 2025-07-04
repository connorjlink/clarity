import * as ws from 'ws';
import * as http from 'http';

type EndpointHandlers = {
    onOpen?: (ws: ws.WebSocket, req: any) => void;
    onClose?: (ws: ws.WebSocket, code: number, reason: Buffer) => void;
    onMessage?: (ws: ws.WebSocket, message: ws.RawData) => void;
    onError?: (ws: ws.WebSocket, error: Error) => void;
};

export class SocketRouter {
    private server: http.Server;
    private wss: ws.WebSocketServer;
    private endpoints: Map<string, EndpointHandlers> = new Map();

    constructor(port: number) {
        this.server = http.createServer();
        this.wss = new ws.WebSocketServer({ noServer: true });

        this.wss.on('connection', (ws: ws.WebSocket, request: http.IncomingMessage) => {
            const url = request.url || '/';
            const handlers = this.endpoints.get(url);
            if (!handlers) {
                ws.close(1008, 'Endpoint not found');
                return;
            }
            handlers.onOpen?.(ws, request);
            ws.on('message', (msg) => handlers.onMessage?.(ws, msg));
            ws.on('close', (code, reason) => handlers.onClose?.(ws, code, reason));
            ws.on('error', (err) => handlers.onError?.(ws, err));
        });

        this.server.on('upgrade', (request, socket, head) => {
            this.wss.handleUpgrade(request, socket, head, (ws) => {
                this.wss.emit('connection', ws, request);
            });
        });

        this.server.listen(port, () => {
            console.log(`clarity-ls server open on port ${port}`);
        });
    }

    attachEndpoint(path: string, handlers: EndpointHandlers) {
        this.endpoints.set(path, handlers);
    }

    removeEndpoint(path: string) {
        this.endpoints.delete(path);
    }
}