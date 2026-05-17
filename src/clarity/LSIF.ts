export enum LSIFVertexLabel {
    MetaData = "metaData",
    Project = "project",
    Document = "document",
    Range = "range",
    ResultSet = "resultSet",
    DefinitionResult = "definitionResult",
    DeclarationResult = "declarationResult",
    HoverResult = "hoverResult",
    ReferenceResult = "referenceResult",
    Moniker = "moniker"
}

export enum LSIFEdgeLabel {
    Contains = "contains",
    Item = "item",
    Next = "next",
    TextDocumentDefinition = "textDocument/definition",
    TextDocumentDeclaration = "textDocument/declaration",
    TextDocumentHover = "textDocument/hover",
    TextDocumentReference = "textDocument/references",
    TextDocumentImplementation = "textDocument/implementation",
    TextDocumentTypeDefinition = "textDocument/typeDefinition",
    TextDocumentFoldingRange = "textDocument/foldingRange",
    TextDocumentDocumentLink = "textDocument/documentLink",
    TextDocumentDocumentSymbol = "textDocument/documentSymbol",
    TextDocumentDiagnostic = "textDocument/diagnostic",
    TextDocumentSemanticTokens = "textDocument/semanticTokens/full",
    Moniker = "moniker"
}

export type Id = number;

export interface Vertex {
    id: Id;
    type: "vertex";
    label: LSIFVertexLabel;
    [key: string]: any;
}

export interface Edge {
    id: Id;
    type: "edge";
    label: LSIFEdgeLabel;
    outV: Id;
    inV?: Id;
    inVs?: Id[];
    [key: string]: any;
}

export interface MetaDataVertex extends Vertex {
    label: LSIFVertexLabel.MetaData;
    version: string;
    projectRoot: string;
    positionEncoding: string;
}

export interface DocumentVertex extends Vertex {
    label: LSIFVertexLabel.Document;
    uri: string;
    languageId: string;
}

export interface RangeVertex extends Vertex {
    label: LSIFVertexLabel.Range;
    start: Position;
    end: Position;
}

export interface Position {
    line: number;
    character: number;
}

export namespace LSIF {
    export type AnyVertex = MetaDataVertex | DocumentVertex | RangeVertex | Vertex;
    export type AnyEdge = Edge;
}
