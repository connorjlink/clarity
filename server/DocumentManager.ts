import * as rpc from '../common/JSONRPC.ts';
import * as lsp from '../common/LSP.ts';

export class LSPDocument {
    uri: string;
    languageId: string;
    lines: string[];
    version: lsp.integer;
    symbols: lsp.WorkspaceSymbol[]
    diagnostics: lsp.Diagnostic[];

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
        if (newLines.length === 1) {
            // single-line replacement
            const replacedLine = beforeText + newLines[0] + afterText;
            return [...before, replacedLine, ...after];
        } else {
            // multi-line replacement
            const firstLine = beforeText + newLines[0];
            const lastLine = newLines[newLines.length - 1] + afterText;
            const middleLines = newLines.slice(1, -1);
            return [...before, firstLine, ...middleLines, lastLine, ...after];
        }
    }

    // lazy-loading and caching the text representation should help performance since the document synchronizes
    // incrementally, but avoid using these functions when possible nonetheless!

    private lastGetTextVersion: lsp.integer = -1;
    private text: string = '';

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
