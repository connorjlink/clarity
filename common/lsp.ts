// see https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/

export type integer = number;

export type uinteger = number;

export type decimal = number;

export type LSPAny = LSPObject | LSPArray | string | integer | uinteger |
	decimal | boolean | null;

export type LSPObject = { [key: string]: LSPAny };

export type LSPArray = LSPAny[];

export namespace MessageKind {
    export const Error = 1;
    export const Warning = 2;
    export const Info = 3;
    export const Log = 4;
    export const Debug = 5;
}

export type MessageKindType = 1 | 2 | 3 | 4 | 5;

export namespace SymbolKind {
	export const File = 1;
	export const Module = 2;
	export const Namespace = 3;
	export const Package = 4;
	export const Class = 5;
	export const Method = 6;
	export const Property = 7;
	export const Field = 8;
	export const Constructor = 9;
	export const Enum = 10;
	export const Interface = 11;
	export const Function = 12;
	export const Variable = 13;
	export const Constant = 14;
	export const String = 15;
	export const Number = 16;
	export const Boolean = 17;
	export const Array = 18;
	export const Object = 19;
	export const Key = 20;
	export const Null = 21;
	export const EnumMember = 22;
	export const Struct = 23;
	export const Event = 24;
	export const Operator = 25;
	export const TypeParameter = 26;
}

export type SymbolKind = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26;

export namespace TextDocumentSyncKind {
	export const None = 0;
	export const Full = 1;
	export const Incremental = 2;
}

export type TextDocumentSyncKind = 0 | 1 | 2;

export type Position = {
    line: uinteger;
    character: uinteger;
}

export type Range = {
    start: Position;
    end: Position;
}

export type WorkspaceSymbol = {
    name: string;
    detail?: string; // e.g., the signature of a function
    kind: SymbolKind;
    tags?: integer[]; // DO NOT USE, FOR DEPRECATED ONLY
    containerName?: string; // e.g., struct name for members
    location: {
        uri: string;
        range: Range;
    };
    data?: LSPAny; // DO NOT USE
}

export namespace DiagnosticSeverity {
    export const Error: DiagnosticSeverity = 1;
    export const Warning: DiagnosticSeverity = 2;
    export const Information: DiagnosticSeverity = 3;
    export const Hint: DiagnosticSeverity = 4;
}

export type DiagnosticSeverity = 1 | 2 | 3 | 4;

export type Diagnostic = {
    range: Range;
    severity?: DiagnosticSeverity;
    code?: string | integer;
    codeDescription?: { href: string; };
    source?: string; // e.g., "haze"
    message: string;
    tags?: integer[]; // DO NOT USE, FOR UNNCESSARY/DEPRECATED ONLY
    relatedInformation?: {
        location: {
            uri: string;
            range: Range;
        };
        message: string;
    }[];
    data?: LSPAny; // DO NOT USE
}
