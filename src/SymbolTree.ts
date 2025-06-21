/* eslint-disable @typescript-eslint/no-explicit-any */
export type SymbolType = 'identifier' | 'keyword' | 'literal' | 'operator' | 'punctuation' | 'comment';
export type TypeType = 'value' | 'ptr' | undefined;
export type TypeSpecifier = 'byte' | 'word' | 'dword' | 'qword' | 'string' | 'struct' | 'nvr' | undefined;
export type TypeQualifier = 'const' | 'volatile' | undefined;
export type TypeSignedness = 'signed' | 'unsigned' | undefined;

export interface NodeType {
    friendly_name: string;
    display_color: string; // #rgb
};

export interface Type {
    storage: TypeType;
    specifier: TypeSpecifier;
    qualifier: TypeQualifier;
    signedness: TypeSignedness;
    tag: string | undefined; // for structure-like types only
}

export interface Location {
    line: number;
    column: number;
};

export interface SymbolEntry {
    name: string;
    value: any;
    symbol_type: SymbolType;
    text: string;
    source: string; // translation unit filepath
    location: Location;
};

export interface Macro extends SymbolEntry {
    parameters: string[];
    substitution: string;
};

export interface Parameter extends SymbolEntry {
    parameter_type: Type;
    default_value: any; // optional for parameters with default values
};

export interface Statement {
    statement_type: string;

}

export interface Function extends SymbolEntry {
    return_type: Type;
    parameters: Parameter[];
    statement: Statement;
};

export interface ProgramTree {
    macros: Macro[];
    functions: Function[];
};

export type SymbolTree = {
    header: {
        version: string,
        format: string,
        created_at: Date,
        author: string,
        command_line: string,
    },
    symbols: SymbolEntry[],
    ast: {
        metadata: {
            optimization: string,
            unoptimized_size: number,
            optimized_size: number,
            nodes: Node[]
        },
        unoptimized: ProgramTree,
        optimized: ProgramTree,
    }
};
