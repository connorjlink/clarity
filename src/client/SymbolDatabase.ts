import * as lsp from '../common/LSP'

export const TypeStorages = ['value', 'ptr'];
export const TypeSpecifiers = ['byte', 'word', 'dword', 'qword', 'string', 'struct', 'nvr'];
export const TypeQualifiers = ['const', 'volatile'];
export const TypeSignedness = ['signed', 'unsigned'];
export const TypeStages = ['source', 'ast', 'ir', 'asm', 'o'];

export class SymbolDatabase {
    // maps identifier names as searchable entities
    private symbols: Map<string, lsp.WorkspaceSymbol>;
    // relational db
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private tree: any;

    public lastSynchronized: Date | null = null;
    
    constructor() {
        this.symbols = new Map<string, lsp.WorkspaceSymbol>();
    }

    notifyListener(listener: any, message: string): void {
        if (listener) {
            try {
                listener.notify(message);
            } catch (error) {
                console.error('Error notifying listener:', error);
            }
        } else {
            console.warn('No listener to notify of message `' + message + '`');
        }
    }

    lookup(name: string, line: number, column: number): lsp.WorkspaceSymbol | undefined {
        const entry = this.symbols.get(name);
        if (!entry) {
            return undefined;
        }
        // NOTE: only check the range start location--does not factor symbols that overlap (which is almost guaranteed to happen somewhat for the machine code step)
        if (entry.location && entry.location.range.start.line === line && entry.location.range.start.character === column) {
            return entry;
        }
        return undefined;
    }

    addSymbol(name: string, entry: lsp.WorkspaceSymbol): void {
        this.symbols.set(name, entry);
    }
    
    getSymbol(name: string): lsp.WorkspaceSymbol | undefined {
        return this.symbols.get(name);
    }
    
    hasSymbol(name: string): boolean {
        return this.symbols.has(name);
    }
    
    removeSymbol(name: string): boolean {
        return this.symbols.delete(name);
    }
    
    getAllSymbols(): lsp.WorkspaceSymbol[] {
        return Array.from(this.symbols.values());
    }
    
    clear(): void {
        this.symbols.clear();
    }
}
