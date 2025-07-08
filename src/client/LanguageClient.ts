export class LanguageClient {



    private internal_synchronize_from(filepath: string, host: string, port: string, listener: any, retry_counter: number): void {
        const socket = new WebSocket(`ws://${host}:${port}/symboldb`);
        socket.onopen = (event: Event) => {
            this.notifyListener(listener, `database synchronization started: ${event}`);
            const command_line = `${filepath} --architecture=haze --verbosity=verbose --execution=compile --output=raw`;
            socket.send(`[request synchronize]~(${command_line})`);
        }
        socket.onmessage = (event: Event) => {
            this.notifyListener(listener, `database synchronization received: ${event}`);
            const db = JSON.parse((event as MessageEvent).data);
            this.tree = db;
            const symbols = db.symbols as SymbolEntry[];
            for (const symbol of symbols) {
                try {
                    this.addSymbol(symbol.name, symbol as SymbolEntry);
                } catch (e) {
                    this.notifyListener(listener, `database symbol error for ${symbol.name}: ${e}`);
                }
            }
            this.lastSynchronized = new Date(); // now!
        }
        socket.onclose = (event: Event) => {
            this.notifyListener(listener, `database synchronization completed: ${event}`);
        }
        socket.onerror = (event: Event) => {
            this.notifyListener(listener, `database synchronization failure: ${event}`);
            this.internal_synchronize_from(filepath, host, port, listener, retry_counter - 1);
        }
    }
}

const client = new LanguageClient();

