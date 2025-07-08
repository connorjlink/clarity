type EndpointHandlers = {
    ws?: WebSocket; // optional websocket reference
    onOpen?: (ws: WebSocket, req: any) => void;
    onClose?: (ws: WebSocket, code: number, reason: Buffer) => void;
    onMessage?: (ws: WebSocket, message: any) => void;
    onError?: (ws: WebSocket, error: Error) => void;
};

export class SocketRouter {
    private server: http.Server;
    private wss: ws.WebSocketServer;
    private endpoints: Map<string, EndpointHandlers> = new Map();

    constructor(port: number) {
        this.server = http.createServer();
        this.wss = new WebSocketServer({ noServer: true });

        this.wss.on('connection', (ws: WebSocket, request: http.IncomingMessage) => {
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
            // NOTE: requires that the handlers be a mutable reference
            handlers.ws = ws;
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