import * as lsp from '../common/lsp';

export class LSPDocument {
    version: lsp.integer;
    symbols: lsp.WorkspaceSymbol[]
    diagnostics: lsp.Diagnostic[];
}

export class DocumentManager {
    // uri -> LSPDocument
    private documents: Map<string, LSPDocument> = new Map();

    getDocument(uri: string): LSPDocument {
        const doc = this.documents.get(uri);
        if (!doc) {
            throw new Error(`Document with URI ${uri} not found`);
        }
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
