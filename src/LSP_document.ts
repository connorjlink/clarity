import * as lsp from './LSP';
import * as nt from './node_types';

export type HazeSymbol = {
    location: {
        position: lsp.integer;
        column: lsp.integer;
        line: lsp.integer;
        filepath: string;
        stage: string;
    };
    text: string;
    name: string;
    value: any | null;
    type: string;
    confidence: lsp.integer;
    isDeclaration: boolean;
}

export type HazeNode = {
    symbols: lsp.WorkspaceSymbol[] | undefined;
    nodes: nt.NodeData[] | undefined;
}

type TaskTime = {
    task: string; 
    elapsedMicroseconds: number; 
}

// NOTE: for data visualization purposes only! TODO: add more statistics as they arise in the compiler
type InternalStatistic = {
    memoryUsage: number; // in bytes, probably just allocated through the Tracker
    trackedEntityInstantiations: number; // number of tracked objects instantiated
    trackedEntityRetirements: number; // number of tracked objects instantiated
    trackedEntityDestructions: number; // number of tracked objects destroyed
    functionCount: number; // number of functions defined
    statementCount: number; // number of statements executed
    expressionCount: number; // number of expressions evaluated
    symbolCount: number; // number of symbols indexed
    elapsedTime: TaskTime[];
}

export type HazeStatistic = {
    stage: string; 
    filepath: string;

    data: {
        // detailed performance metrics about the compiler
        internal: InternalStatistic | undefined;

    }

    
}

type EditDelta = {
    range: lsp.Range;
    lineDelta: number;
    charDelta: number;
};

export function convertHazeSymbolTypeToLSPKind(type: string): lsp.SymbolKind {
    switch (type) {
        case 'file':
            return lsp.SymbolKind.File;
        case 'module':
            return lsp.SymbolKind.Module;
        case 'namespace':
            return lsp.SymbolKind.Namespace;
        case 'package':
            return lsp.SymbolKind.Package;
        case 'class':
            return lsp.SymbolKind.Class;
        case 'method':
            return lsp.SymbolKind.Method;
        case 'property':
            return lsp.SymbolKind.Property;
        case 'field':
            return lsp.SymbolKind.Field;
        case 'constructor':
            return lsp.SymbolKind.Constructor;
        case 'enum':
            return lsp.SymbolKind.Enum;
        case 'interface':
            return lsp.SymbolKind.Interface;
        case 'function':
            return lsp.SymbolKind.Function;
        case 'variable':
            return lsp.SymbolKind.Variable;
        case 'constant':
            return lsp.SymbolKind.Constant;
        case 'string':
            return lsp.SymbolKind.String;
        case 'number':
            return lsp.SymbolKind.Number;
        case 'boolean':
            return lsp.SymbolKind.Boolean;
        case 'array':
            return lsp.SymbolKind.Array;
        case 'object':
            return lsp.SymbolKind.Object;
        case 'key':
            return lsp.SymbolKind.Key;
        case 'null':
            return lsp.SymbolKind.Null;
        case 'enumerator':
            return lsp.SymbolKind.EnumMember;
        case 'struct':
            return lsp.SymbolKind.Struct;
        case 'event':
            return lsp.SymbolKind.Event;
        case 'operator':
            return lsp.SymbolKind.Operator;
        case 'typeParameter':
            return lsp.SymbolKind.TypeParameter;
        default:
            return lsp.SymbolKind.Object; // fallback
    }
}

export type InternalSymbol = {
    symbol: lsp.WorkspaceSymbol;
    isDeclaration: boolean; // true only if an an orignial forward declaration or definition
}

export class LSPDocument {

    // symbol name => [symbols]
    private symbolsByName: Map<string, InternalSymbol[]> = new Map();
    // location key => symbol (unique)
    private symbolsByLocation: Map<lsp.Position, InternalSymbol> = new Map();
    // composite key (name:line:character) => symbol (unique)
    private symbolsByComposite: Map<string, InternalSymbol> = new Map();
    private symbols: InternalSymbol[] = [];
    private diagnostics: lsp.Diagnostic[] = [];
    
    // document text editor tracking
    private editDeltas: EditDelta[] = [];
    private lastGetTextVersion: lsp.integer = -1;
    private text: string = '';

    constructor(
        public uri: string,
        public languageId: string,
        public lines: string[] = [],
        public version: lsp.integer = 0
    ) {
        // properties automatically initialized
    }
    
    addDiagnostic(diagnostic: lsp.Diagnostic) {
        // NOTE: do not need to apply deltas because the diagnostic range will compute dynamically for publish
        // See getDiagnostics() for the proper application of editor text deltas.
        this.diagnostics.push(diagnostic);
    }

    getDiagnostics(): lsp.Diagnostic[] {
        return this.diagnostics.map(d => ({
            ...d,
            range: {
                start: this.applyDeltasToPosition(d.range.start),
                end: this.applyDeltasToPosition(d.range.end)
            }
        }));
    }
    
    getSymbolsByName(name: string): InternalSymbol[] {
        const syms = this.symbolsByName.get(name);
        if (!syms) {
            return [];
        }
        return syms.map(sym => ({
            symbol: {
                ...sym.symbol,
                location: {
                    ...sym.symbol.location,
                    range: {
                        start: this.applyDeltasToPosition(sym.symbol.location.range.start),
                        end: this.applyDeltasToPosition(sym.symbol.location.range.end)
                    }
                }
            },
            isDeclaration: sym.isDeclaration
        }));
    }

    getSymbolsByNamePrefix(prefix: string): InternalSymbol[] {
        const results: InternalSymbol[] = [];
        for (const [name, syms] of this.symbolsByName.entries()) {
            if (name.startsWith(prefix)) {
                for (const sym of syms) {
                    results.push({
                        symbol: {
                            ...sym.symbol,
                            location: {
                                ...sym.symbol.location,
                                range: {
                                    start: this.applyDeltasToPosition(sym.symbol.location.range.start),
                                    end: this.applyDeltasToPosition(sym.symbol.location.range.end)
                                }
                            }
                        },
                        isDeclaration: sym.isDeclaration
                    });
                }
            }
        }
        return results;
    }

    getSymbolByPosition(position: lsp.Position): InternalSymbol | null {
        const originalPosition = this.revertDeltasFromPosition(position);
        const symbol = this.symbolsByLocation.get(originalPosition);
        if (!symbol) {
            return null;
        }
        return {
            symbol: {
                ...symbol.symbol,
                location: {
                    ...symbol.symbol.location,
                    range: {
                        start: this.applyDeltasToPosition(symbol.symbol.location.range.start),
                        end: this.applyDeltasToPosition(symbol.symbol.location.range.end)
                    }
                }
            },
            isDeclaration: symbol.isDeclaration
        };
    }

    /** Useful to generate completion list items. Produces the fragment of "progress" text before a new symbol is generated while typing. */
    getTextFragmentBeforePosition(position: lsp.Position): string | null {
        const originalPosition = this.revertDeltasFromPosition(position);
        const line = this.lines[originalPosition.line] || '';
        
        const cursor = originalPosition.character;
        const left = line.slice(0, cursor);
        // NOTE: this is a bit too greedy (e.g., 1hello would match "hello"), but it's OK for now
        const match = left.match(/[a-zA-Z_][a-zA-Z0-9_]*$/);
        
        return match ? match[0] : null;
    }

    getSymbolAroundPosition(position: lsp.Position): InternalSymbol | null {
        const originalPosition = this.revertDeltasFromPosition(position);
        for (const symbol of this.symbols) {
            const range = symbol.symbol.location.range;
            // return any symbol with a range that encompasses the original position
            if (
                (originalPosition.line > range.start.line ||
                    (originalPosition.line === range.start.line && originalPosition.character >= range.start.character)) &&
                (originalPosition.line < range.end.line ||
                    (originalPosition.line === range.end.line && originalPosition.character <= range.end.character))
            ) {
                return {
                    symbol: {
                        ...symbol.symbol,
                        location: {
                            ...symbol.symbol.location,
                            range: {
                                start: this.applyDeltasToPosition(range.start),
                                end: this.applyDeltasToPosition(range.end)
                            }
                        }
                    },
                    isDeclaration: symbol.isDeclaration
                };
            }
        }
        return null;
    }

    getAllSymbols(): InternalSymbol[] {
        return this.symbols.map(sym => ({
            ...sym,
            location: {
                ...sym.symbol.location,
                range: {
                    start: this.applyDeltasToPosition(sym.symbol.location.range.start),
                    end: this.applyDeltasToPosition(sym.symbol.location.range.end)
                }
            }
        }));
    }

    addOrUpdateSymbol(symbol: InternalSymbol, name: string) {
        const position = symbol.symbol.location.range.start;
        const compositeKey = LSPDocument.compositeKey(name, position);

        let existing = this.symbolsByComposite.get(compositeKey);
        if (existing) {
            Object.assign(existing, symbol);
        } else {
            if (!this.symbolsByName.has(name)) {
                this.symbolsByName.set(name, []);
            }
            this.symbols.push(symbol);
            this.symbolsByName.get(name)!.push(symbol); // non-null strengthened
            this.symbolsByLocation.set(position, symbol);
            this.symbolsByComposite.set(compositeKey, symbol);
        }
    }

    invalidateSymbols() {
        this.symbols = [];
        this.symbolsByName.clear();
        this.symbolsByLocation.clear();
        this.symbolsByComposite.clear();
        this.editDeltas = [];
    }

    upsertRawSymbol(json: string) {
        const symbol: HazeSymbol = JSON.parse(json);
        this.upsertSymbol(symbol);
    }

    upsertSymbol(symbol: HazeSymbol) {
        const workspaceSymbol: lsp.WorkspaceSymbol = {
            name: symbol.name,
            kind: convertHazeSymbolTypeToLSPKind(symbol.type),
            location: {
                uri: this.uri,
                range: {
                    start: { line: symbol.location.line, character: symbol.location.column },
                    end: { line: symbol.location.line, character: symbol.location.column + (symbol.text?.length ?? 1) }
                }
            }
        };
        const internalSymbol: InternalSymbol = {
            symbol: workspaceSymbol,
            isDeclaration: symbol.isDeclaration
        };
        this.addOrUpdateSymbol(internalSymbol, symbol.name);
    }

    applyDeltasToPosition(pos: lsp.Position): lsp.Position {
        let newPosition = { ...pos };
        for (const delta of this.editDeltas) {
            // only apply the deltas that could affect this position
            if (
                newPosition.line > delta.range.end.line ||
                (newPosition.line === delta.range.end.line && newPosition.character >= delta.range.end.character)
            ) {
                newPosition.line += delta.lineDelta;
                if (newPosition.line === delta.range.end.line) {
                    newPosition.character += delta.charDelta;
                }
            }
        }
        return newPosition;
    }

    revertDeltasFromPosition(pos: lsp.Position): lsp.Position {
        let origPosition = { ...pos };
        for (let i = this.editDeltas.length - 1; i >= 0; i--) {
            const delta = this.editDeltas[i];
            // only revert the deltas that could affect this position
            if (
                origPosition.line > delta.range.end.line + delta.lineDelta ||
                (origPosition.line === delta.range.end.line + delta.lineDelta &&
                    origPosition.character >= delta.range.end.character + (delta.lineDelta === 0 ? delta.charDelta : 0))
            ) {
                origPosition.line -= delta.lineDelta;
                if (origPosition.line === delta.range.end.line) {
                    origPosition.character -= delta.charDelta;
                }
            }
        }
        return origPosition;
    }

    applyTextEdit(
        lines: string[],
        range: lsp.Range,
        newText: string
    ): string[] {
        const before = lines.slice(0, range.start.line);
        const startLine = lines[range.start.line] ?? '';
        const endLine = lines[range.end.line] ?? '';
        const after = lines.slice(range.end.line + 1);

        const beforeText = startLine.slice(0, range.start.character);
        const afterText = endLine.slice(range.end.character);

        const newLines = newText.split('\n');
        const lineDelta = newLines.length - (range.end.line - range.start.line + 1);
        const charDelta = (newLines.length === 1)
            ? (newLines[0].length - (range.end.character - range.start.character))
            : (newLines[newLines.length - 1].length - range.end.character);

        // compute the edit delta--used to store a running history of edits until the next full document refresh
        this.editDeltas.push({
            range,
            lineDelta,
            charDelta
        });

        let replacement: string[];

        if (newLines.length === 1) {
            // single-line replacement
            const replacedLine = beforeText + newLines[0] + afterText;
            replacement = [...before, replacedLine, ...after];
        } else {
            // multi-line replacement
            const firstLine = beforeText + newLines[0];
            const lastLine = newLines[newLines.length - 1] + afterText;
            const middleLines = newLines.slice(1, -1);
            replacement = [...before, firstLine, ...middleLines, lastLine, ...after];
        }

        return replacement;
    }

    // lazy-loading and caching the text representation should help performance since the document synchronizes
    // incrementally, but avoid using these functions when possible nonetheless!

    setLines(text: string): void {
        this.lines = text.split('\n');
    }

    getText(): string {
        if (this.lastGetTextVersion < this.version) {
            // no change since last getText, return cached value
            this.text = this.lines.join('\n');
            this.lastGetTextVersion = this.version;
        }

        return this.text;
    }

    ////////////////////////////////////////////////////

    private static compositeKey(name: string, pos: lsp.Position): string {
        return `${name}:${pos.line}:${pos.character}`;
    }
}

export class DocumentManager {
    // uri -> LSPDocument
    private documents: Map<string, LSPDocument> = new Map();

    getDocument(uri: string): LSPDocument | undefined {
        return this.documents.get(uri)!;
    }

    hasDocument(uri: string): boolean {
        return this.documents.has(uri);
    }

    createDocument(uri: string, doc: LSPDocument): void {
        this.documents.set(uri, doc);
    }

    deleteDocument(uri: string): void {
        this.documents.delete(uri);
    }

    zipAllDocuments(): MapIterator<[string, LSPDocument]> {
        return this.documents.entries();
    }
}
