import { type SymbolType, type SymbolEntry } from './SymbolTree'

export class SymbolDatabase {
    // maps identifier names as searchable entities
    private symbols: Map<string, SymbolEntry>;
    // relational db
    //private tree: SymbolTree;
    
    constructor() {
        this.symbols = new Map<string, SymbolEntry>();
        //this.tree = new SymbolTree();
    }

    // blocking connection to the local database server
    synchronize_with(filepath: string, host: string, port: string, listener: any): void {
        throw new Error("Method not implemented. Use synchronize_from instead.");
    }

    // non-blocking connection to the local database server
    synchronize_from(filepath: string, host: string, port: string, listener: any): void {
        const retry_counter = 2;
        this.internal_synchronize_from(filepath, host, port, listener, retry_counter);
    }

    private internal_synchronize_from(filepath: string, host: string, port: string, listener: any, retry_counter: number): void {
        const socket = new WebSocket(`ws://${host}:${port}/symboldb`);
        this.clear();
        socket.onopen = (event: Event) => {
            listener.notify(`database synchronization started: ${event}`);
            const command_line = `${filepath} --architecture=haze --verbosity=verbose --execution=compile --output=raw`;
            socket.send(`[request synchronize]~(${command_line})`);
        }
        socket.onmessage = (event: Event) => {
            listener.notify(`database synchronization received: ${event}`);
            const symbol_array = JSON.parse((event as MessageEvent).data) as SymbolEntry[];
        }
        socket.onclose = (event: Event) => {
            listener.notify(`database synchronization completed: ${event}`);
        }
        socket.onerror = (event: Event) => {
            listener.notify(`database synchronization failure: ${event}`);
            this.internal_synchronize_from(filepath, host, port, listener, retry_counter - 1);
        }
        // the server will close the connection when it finishes synchronizing, so no need to manually clean up
    }

    addSymbol(name: string, value: any, type: SymbolType): void {
        this.symbols.set(name, { name, value, type });
    }
    
    getSymbol(name: string): SymbolEntry | undefined {
        return this.symbols.get(name);
    }
    
    hasSymbol(name: string): boolean {
        return this.symbols.has(name);
    }
    
    removeSymbol(name: string): boolean {
        return this.symbols.delete(name);
    }
    
    getAllSymbols(): SymbolEntry[] {
        return Array.from(this.symbols.values());
    }
    
    clear(): void {
        this.symbols.clear();
    }
}
