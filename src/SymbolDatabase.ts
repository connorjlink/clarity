export const TypeStorages = ['value', 'ptr'];
export const TypeSpecifiers = ['byte', 'word', 'dword', 'qword', 'string', 'struct', 'nvr'];
export const TypeQualifiers = ['const', 'volatile'];
export const TypeSignedness = ['signed', 'unsigned'];
export const TypeStages = ['source', 'ast', 'ir', 'asm', 'o'];

export interface SymbolEntry {
    name: string;
    value: any;
    type: string;
    text: string;
    filepath: string; // translation unit filepath
    markup: string;
    location: {
        line: number;
        column: number; // location varies by stage
        stage: string;
    };
};

export class SymbolDatabase {
    // maps identifier names as searchable entities
    private symbols: Map<string, SymbolEntry>;
    // relational db
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private tree: any;

    public lastSynchronized: Date | null = null;
    
    constructor() {
        this.symbols = new Map<string, SymbolEntry>();
    }

    lookup(name: string, line: number, column: number): SymbolEntry | undefined {
        const entry = this.symbols.get(name);
        if (!entry) {
            return undefined;
        }
        if (entry.location && entry.location.line === line && entry.location.column === column) {
            return entry;
        }
        return undefined;
    }

    // non-blocking connection to the local database server
    synchronize_from(filepath: string, host: string, port: string, listener: any): void {
        const retry_counter = 2;
        this.internal_synchronize_from(filepath, host, port, listener, retry_counter);
    }

    private internal_synchronize_from(filepath: string, host: string, port: string, listener: any, retry_counter: number): void {
        const socket = new WebSocket(`ws://${host}:${port}/symboldb`);
        socket.onopen = (event: Event) => {
            listener.notify(`database synchronization started: ${event}`);
            const command_line = `${filepath} --architecture=haze --verbosity=verbose --execution=compile --output=raw`;
            socket.send(`[request synchronize]~(${command_line})`);
        }
        socket.onmessage = (event: Event) => {
            listener.notify(`database synchronization received: ${event}`);
            const db = JSON.parse((event as MessageEvent).data);
            this.tree = db;
            const symbols = db.symbols as SymbolEntry[];
            for (const symbol of symbols) {
                try {
                    this.addSymbol(symbol.name, symbol as SymbolEntry);
                } catch (e) {
                    listener.notify(`database symbol error for ${symbol.name}: ${e}`);
                }
            }
            this.lastSynchronized = new Date(); // now!
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

    addSymbol(name: string, entry: SymbolEntry): void {
        this.symbols.set(name, entry);
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
