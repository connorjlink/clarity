import * as rpc from './JSONRPC';
import * as lsp from './LSP';
import * as doc from './LSP_document';
import * as cd from './compiler_driver';

type MethodNames = Exclude<{
    [K in keyof LanguageServer]: LanguageServer[K] extends Function ? K : never }[keyof LanguageServer],
    'execute'
>

function getKeywordsForLanguage(languageId: string): lsp.CompletionItem[] {
    switch (languageId) {
        // standard compiler set
        case 'haze':
            return [
                // TYPE QUALIFIERS
                {
                    label: 'immutable',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Type qualifier declaring logical and bitwise constancy.',
                    documentation: 'Denotes that instances of the specified type cannot be modified after initialization.',
                    insertText: 'immutable ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'mutable',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Type qualifier declaring logical and bitwise mutability.',
                    documentation: 'Denotes that instances of the specified type can be modified after initialization.',
                    insertText: 'mutable ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },

                // TYPE SIGNEDNESS
                {
                    label: 'unsigned',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Type signedness declaring an unsigned integrality.',
                    documentation: 'Denotes that instances of the specified type should be treated as unsigned.',
                    insertText: 'unsigned ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'signed',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Type signedness declaring a signed integrality.',
                    documentation: 'Denotes that instances of the specified type should be treated as signed.',
                    insertText: 'signed ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },

                // TYPE STORAGE
                {
                    label: 'value',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Type storage declaring a value type.',
                    documentation: 'Denotes that instances of the specified type are treated and passed by value.',
                    insertText: 'value ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'ptr',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Type storage declaring a pointer (reference) type.',
                    documentation: 'Denotes that instances of the specified type serve as reference pointers to a different underlying object.',
                    insertText: 'ptr ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },

                // TYPE SPECIFIERS
                {
                    label: 'struct',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Type specifier declaring a struct (composite) type.',
                    documentation: 'Denotes that instances of the specified type refer to a composite object.',
                    insertText: 'struct ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'byte',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Type specifier declaring a byte integer type.',
                    documentation: 'Denotes that instances of the specified type are byte integers exactly 8 bits in size.',
                    insertText: 'word ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'word',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Type specifier declaring a word integer type.',
                    documentation: 'Denotes that instances of the specified type are word integers exactly 16 bits in size.',
                    insertText: 'word ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'dword',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Type specifier declaring a double-word integer type.',
                    documentation: 'Denotes that instances of the specified type are double-word integers exactly 32 bits in size.',
                    insertText: 'dword ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'qword',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Type specifier declaring a quad-word integer type.',
                    documentation: 'Denotes that instances of the specified type are quad-word integers exactly 64 bits in size.',
                    insertText: 'qword ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'string',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Type qualifier declaring a string type.',
                    documentation: 'Denotes that instances of the specified type refer to character strings.',
                    insertText: 'string ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'nvr',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Type qualifier declaring a non-value–returning function..',
                    documentation: 'Denotes that a function produces no return value. Not valid for variable declarations.',
                    insertText: 'nvr ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },
                
                // KEYWORDS
                {
                    label: 'declare',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Keyword declaring or defining a variable or function.',
                    documentation: 'Declares or defines a variable or function with the specified name and associated type(s).',
                    insertText: 'declare ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'proto',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Keyword declaring a function prototype.',
                    documentation: 'Declares a function signature prototype with the specified name and associated type(s).',
                    insertText: 'proto ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'print',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Keyword printing a string or integer type to the standard console.',
                    documentation: 'Prints the specified value to the console output.',
                    insertText: 'print(${1:value})',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'intrinsic',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'IMPORTANT: DO NOTE USE.',
                    documentation: 'Reserved keyword for future language use. IMPORTANT: DO NOT USE.',
                    insertText: 'intrinsic ',
                    insertTextFormat: 1, // plain text
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'function',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Keyword declaring a function.',
                    documentation: 'Declares a function with the specified name and associated type(s).',
                    insertText: 'function ${1:type} ${2:name} = (${3:params})\n{\n\t$0\n}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 2 // adjust whitespace since multi-line completion
                },
                {
                    label: 'return',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Keyword returning a value from a function.',
                    documentation: 'Returns the specified value from the current function.',
                    insertText: 'return ${1:value}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },               
                {
                    label: 'while',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Keyword denoting a uniconditional loop statement.',
                    documentation: 'Executes the given block of code while the specified condition remains true.',
                    insertText: 'while (${1:condition})\n{\n\t$0\n}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 2 // adjust whitespace since multi-line completion
                },
                {
                    label: 'for',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Keyword denoting a definite conditional loop statement.',
                    documentation: 'Executes the given block of code according to the specified initialization, condition, and increment.',
                    insertText: 'for (${1:initialization}; ${2:condition}; ${3:increment})\n{\n\t$0\n}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 2 // adjust whitespace since multi-line completion
                },
                {
                    label: 'if',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Conditional statement corresponding to branched machine logic.',
                    documentation: 'Conditionally executes the given block of code according to the specified condition.',
                    insertText: 'if (${1:condition})\n{\n\t$0\n}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 2 // adjust whitespace since multi-line completion
                },
                {
                    label: 'else',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Conditional statement corresponding to branched machine logic.',
                    documentation: 'Conditionally executes the given block of code when the associated condition proved false.',
                    insertText: 'else\n{\n\t$0\n}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 2 // adjust whitespace since multi-line completion
                },
                {
                    label: 'asm',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Keyword denoting a _Haze_ inline assembly block.',
                    documentation: 'Denotes an Haze inline assembly statement useful for low-level operations.',
                    insertText: 'asm {\n\t$0\n}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 2 // adjust whitespace since multi-line completion
                },

                // "PREPROCESSOR"
                {
                    label: '.define',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Compiler directive defining a compile-time constant.',
                    documentation: 'Defines a compile-time constant with the specified name and value. Not a preprocessor directive.',
                    insertText: '.define ${1:name} = ${2:value}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: '.include',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Preprocessor directive including a file into the current compilation unit.',
                    documentation: 'Lexically pastes the specified file into the current compilation unit at the point of inclusion.',
                    insertText: '.include "${1:file}"',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: '.macro',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Preprocessor directive defining a macro.',
                    documentation: 'Defines a macro with the specified name and parameters. Not a preprocessor directive.',
                    insertText: '.macro ${1:name} = (${2:params})\n{\n\t$0\n}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 2 // adjust whitespace since multi-line completion
                },
                {
                    label: '.hook',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'IMPORTANT: DO NOTE USE.',
                    documentation: 'Reserved keyword for future language use. IMPORTANT: DO NOT USE.',
                    insertText: '.hook ${1:name}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: '.unhook',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'IMPORTANT: DO NOTE USE.',
                    documentation: 'Reserved keyword for future language use. IMPORTANT: DO NOT USE.',
                    insertText: '.unhook ${1:name}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                }

                // NOTE: EXPLICITLY NOT INCLUDING OPERATORS, ETC.                
            ];

        // inline assembly code
        case 'hazea':
            return [
                {
                    label: 'move',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction moving a value from one location to another.',
                    documentation: 'Moves the specified value from the source location to the destination location.',
                    insertText: 'move ${1:destination}, ${2:source}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'load',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction loading a value from memory into a register.',
                    documentation: 'Loads the specified value from the memory address into the specified register.',
                    insertText: 'load ${1:register}, ${2:address}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'save',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction saving a value from a register to memory.',
                    documentation: 'Saves the specified value from the register to the specified memory address.',
                    insertText: 'save ${1:address}, ${2:register}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'copy',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction copying a an immediate value into the specified register.',
                    documentation: 'Copies the specified immediate value into the specified register.',
                    insertText: 'copy ${1:register}, ${2:value}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'iadd',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction adding two integer values.',
                    documentation: 'Adds the two specified integer values and stores the result in the destination register.',
                    insertText: 'iadd ${1:destination}, ${2:source1}, ${3:source2}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'isub',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction subtracting two integer values.',
                    documentation: 'Subtracts the second specified integer value from the first and stores the result in the destination register.',
                    insertText: 'isub ${1:destination}, ${2:source1}, ${3:source2}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'band',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction performing a bitwise AND operation on two integer values.',
                    documentation: 'Performs a bitwise AND operation on the two specified integer values and stores the result in the destination register.',
                    insertText: 'band ${1:destination}, ${2:source1}, ${3:source2}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'bior',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction performing a bitwise OR operation on two integer values.',
                    documentation: 'Performs a bitwise OR operation on the two specified integer values and stores the result in the destination register.',
                    insertText: 'bior ${1:destination}, ${2:source1}, ${3:source2}',
                    insertTextFormat: 2, // snippet
                },
                {
                    label: 'bxor',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction performing a bitwise XOR operation on two integer values.',
                    documentation: 'Performs a bitwise XOR operation on the two specified integer values and stores the result in the destination register.',
                    insertText: 'bxor ${1:destination}, ${2:source1}, ${3:source2}',
                    insertTextFormat: 2, // snippet
                },
                {
                    label: 'call',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction calling a function.',
                    documentation: 'Calls the specified function with any applied arguments.',
                    insertText: 'call ${1:function}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'exit',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction returning from a function.',
                    documentation: 'Returns from the current function to the address specified on the stack.',
                    insertText: 'exit',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'push',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction pushing a value onto the stack.',
                    documentation: 'Pushes the specified register value onto the stack, decrementing the stack pointer.',
                    insertText: 'push ${1:source}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'pull',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction pulling a value from the stack.',
                    documentation: 'Pulls the top value from the stack into the specified register, incrementing the stack pointer.',
                    insertText: 'pull ${1:destination}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'brnz',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction branching to a label if the specified register is not zero.',
                    documentation: 'Branches to the specified label if the value in the specified register is not zero.',
                    insertText: 'brnz ${1:register}, ${2:label}',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                },
                {
                    label: 'stop',
                    kind: lsp.CompletionItemKind.Keyword,
                    detail: 'Inline assembly instruction immediately stopping execution of the current program.',
                    documentation: 'Stops the execution of the current program immediately, without returning to the caller.',
                    insertText: 'stop',
                    insertTextFormat: 2, // snippet
                    insertTextMode: 1 // no whitespace adjustment
                }
            ];

        // IR code. Haze-specific.
        // this stage is not editable, so it offers no completion items.
        case 'hazei':
            return [];

        // machine code. X86 for now.
        // this stage is not editable, so it offers no completion items.
        case 'hazes':
            return [];

        default: 
            return [];
    }
}

function convertSymbolKindToCompletionItemKind(symbolKind: lsp.SymbolKind): lsp.CompletionItemKind {
    switch (symbolKind) {
        case lsp.SymbolKind.File:
            return lsp.CompletionItemKind.File;

        case lsp.SymbolKind.Module:
        case lsp.SymbolKind.Package:
            return lsp.CompletionItemKind.Module;

        case lsp.SymbolKind.Namespace:
            // maybe this is the wrong choice for completion item kind??
            return lsp.CompletionItemKind.Reference;

        case lsp.SymbolKind.Class:
            return lsp.CompletionItemKind.Class;

        case lsp.SymbolKind.Method:
            return lsp.CompletionItemKind.Method;

        case lsp.SymbolKind.Property:
            return lsp.CompletionItemKind.Property;

        case lsp.SymbolKind.Field:
            return lsp.CompletionItemKind.Field;

        case lsp.SymbolKind.Constructor:
            return lsp.CompletionItemKind.Constructor;

        case lsp.SymbolKind.Enum:
            return lsp.CompletionItemKind.Enum;

        case lsp.SymbolKind.Interface:
            return lsp.CompletionItemKind.Interface;

        case lsp.SymbolKind.Function:
            return lsp.CompletionItemKind.Function;

        case lsp.SymbolKind.Variable:
            return lsp.CompletionItemKind.Variable;

        case lsp.SymbolKind.Constant:
            return lsp.CompletionItemKind.Constant;

        case lsp.SymbolKind.String:
            return lsp.CompletionItemKind.Value;

        case lsp.SymbolKind.Number:
            return lsp.CompletionItemKind.Value;

        case lsp.SymbolKind.Boolean:
            return lsp.CompletionItemKind.Value;

        case lsp.SymbolKind.Array:
            return lsp.CompletionItemKind.Value;

        case lsp.SymbolKind.Object:
            return lsp.CompletionItemKind.Value;

        case lsp.SymbolKind.Key:
            return lsp.CompletionItemKind.Value;

        case lsp.SymbolKind.Null:
            return lsp.CompletionItemKind.Value;

        case lsp.SymbolKind.EnumMember:
            return lsp.CompletionItemKind.EnumMember;

        case lsp.SymbolKind.Struct:
            return lsp.CompletionItemKind.Struct;

        case lsp.SymbolKind.Event:
            return lsp.CompletionItemKind.Event;

        case lsp.SymbolKind.Operator:
            return lsp.CompletionItemKind.Operator;

        case lsp.SymbolKind.TypeParameter:
            return lsp.CompletionItemKind.TypeParameter;

        default:
            // default to text if the symbol kind is not recognized
            return lsp.CompletionItemKind.Text;
    }
}

function logMessage(message: string, type: lsp.MessageKindType = lsp.MessageKind.Log) {
    switch (type) {
        case lsp.MessageKind.Error:
            console.error(`language server error: ${message}`);
            break;
        case lsp.MessageKind.Warning:
            console.warn(`language server warning: ${message}`);
            break;
        case lsp.MessageKind.Info:
            console.info(`language server info: ${message}`);
            break;
        case lsp.MessageKind.Log:
        default:
            console.log(`language server log: ${message}`);
    }
}

export class LanguageServer {

    private hasInitialized: boolean = false;
    private hasShutdown: boolean = false;
    private client: Worker | null = null;

    // NOTE: parent must dynamically dependency inject!
    private compilerDriver: cd.CompilerDriver | null = null;
    private documentManager: doc.DocumentManager | null = null;

    injectDependencies(compilerDriver: cd.CompilerDriver, documentManager: doc.DocumentManager) {
        this.compilerDriver = compilerDriver;
        this.documentManager = documentManager;
    }

    // dynamic dispatch for onMessage callbacks
    execute(key: MethodNames, ...args: any[]) {
        const property = (this as any)[key];
        if (typeof property === 'function') {
            // property is a valid function
            return property.apply(this, args);
        }
        throw new Error(`Method \"${key}\" does not exist on type LanguageServer`);
    }

    /////////////////////////////////////////////////////////

    // NOTE: COMMUNICATION WITH THE LANGUAGE SERVER CLIENT ONLY. THE COMPILER
    // DRIVER HANDLES ALL INTER-PROCESS COMMUNICATION WITH THE BACKEND!

    onOpen(client: Worker) {
        console.log('clarity haze language server socket opened');
        this.client = client;
    }

    onMessage(client: Worker, message: any) {
        try {
            var request: rpc.JSONRPCRequest = JSON.parse(message.toString());

            if (!this.hasInitialized) {
                // the server should exlicitly error requests but ignore notifications
                if (request.id) {
                    client.postMessage(JSON.stringify(
                        rpc.createErrorResponse(
                            request.id, 
                            rpc.JSONRPC_ERRORS.SERVER_NOT_INITIALIZED.code, 
                            rpc.JSONRPC_ERRORS.SERVER_NOT_INITIALIZED.message
                        )));
                }
                return;
            }

            try {
                // dynamically dispatch the request handler
                const method = request.method.replace('/', '_');
                const key = method as MethodNames;
                this.execute(key, client, request);

            } catch (error) {
                // invalid method (or not supported by the server)
                client.postMessage(JSON.stringify(
                    rpc.createErrorResponse(
                        request.id || null, // null for notifications, specified Id for requests
                        rpc.JSONRPC_ERRORS.METHOD_NOT_FOUND.code, 
                        rpc.JSONRPC_ERRORS.METHOD_NOT_FOUND.message + `: ${request.method}`
                    )));
            }

        } catch (error) {
            // generic JSONRPC parse error
            client.postMessage(JSON.stringify(
                rpc.createErrorResponse(
                    null,  // null id for fully invalid request per JSONRPC spec
                    rpc.JSONRPC_ERRORS.PARSE_ERROR.code, 
                    rpc.JSONRPC_ERRORS.PARSE_ERROR.message
                )));
        }
    }

    onClose(client: Worker) {
        console.log('clarity haze language server socket closed');
    }

    onError(client: Worker, error: Error) {
        console.error('clarity haze language server socket error:', error);
    }

    /////////////////////////////////////////////////////////

    private async initialize(client: Worker, request: rpc.JSONRPCRequest) {
        // the client has initialized, now the server can register capabilities
        client.postMessage(JSON.stringify(
            rpc.createSuccessResponse(request.id, {
                capabilities: {
                    textDocumentSync: lsp.TextDocumentSyncKind.Incremental,
                    definitionProvider: true,
                    typeDefinitionProvider: true,
                    hoverProvider: true,
                    completionProvider: {
                        resolveProvider: true,
                        triggerCharacters: ['.', '(', '[', '{'],
                    },
                    documentSymbolProvider: true,
                    documentHighlightProvider: true,
                    semanticTokensProvider: {
                        legend: {
                            // all token types for now
                            tokenTypes: [
                                'file', 'module', 'namespace', 'package',
                                'class', 'method', 'property', 'field', 'constructor',
                                'enum', 'interface', 'function', 'variable',
                                'constant', 'string', 'number', 'boolean',
                                'array', 'object', 'key', 'null', 'enumMember',
                                'struct', 'event', 'operator', 'typeParameter'
                            ],
                            tokenModifiers: [
                                'signed', 'unsigned', 'mutable', 'immutable', 
                                'value', 'ptr', 'nvr', 'struct', 'string',
                                'qword', 'dword', 'word', 'byte'
                            ],
                        },
                        // for now, synchronize semantic tokens completely to avoid having
                        // to compute complex deltas;
                        full: true,
                    },
                    workspaceSymbolProvider: true,
                    workspace: {
                        // not 100% sure if these are correct?
                        didChangeConfiguration: true,
                        didChangeWatchedFiles: true
                    }
                }
            })));
    }
    
    private async initialized(client: Worker, request: rpc.JSONRPCRequest) {
        this.hasInitialized = true;
    }

    private async shutdown(client: Worker, request: rpc.JSONRPCRequest) {
        // the client has requested a shutdown, the server should respond with success
        this.hasShutdown = true;
        client.postMessage(JSON.stringify(
            rpc.createSuccessResponse(request.id, null)
        ));
    }

    private async exit(client: Worker, request: rpc.JSONRPCRequest) {
        if (this.hasShutdown) {
            throw new Error('Exit Code 0: OK');
        }
        throw new Error('Exit Code 1: Not Shut Down');
    }

    private async textDocument_definition(client: Worker, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument.uri;
        const position = request.params.position;

        const existingDocument = this.documentManager?.getDocument(uri);
        if (!existingDocument) {
            this.uriDoesNotExist(client, uri, request.id);
            return;
        }

        const internal = existingDocument.getSymbolAroundPosition(position);
        
        if (internal) {
            if (!internal.isDeclaration) {
                let locations: lsp.Location[] = [];

                const references = existingDocument.getSymbolsByName(internal.symbol.name);
                for (const reference of references) {
                    if (reference.isDeclaration) {
                        locations.push({
                            uri: reference.symbol.location.uri,
                            range: reference.symbol.location.range
                        });
                    }
                }

                if (locations.length > 0) {
                    client.postMessage(JSON.stringify(
                        rpc.createSuccessResponse(request.id, locations)
                    ));
                    return;
                }
            }
            // fallack to the current symbol if no original declaration is found
            client.postMessage(JSON.stringify(
                rpc.createSuccessResponse(request.id, [{
                    uri: internal.symbol.location.uri,
                    range: internal.symbol.location.range
                }])));
        } else {
            client.postMessage(JSON.stringify(
                rpc.createSuccessResponse(request.id, null)
            ));
        }
    }

    public async textDocument_completion(client: Worker, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument.uri;
        const position = request.params.position;
        const context = request.params.context;

        const existingDocument = this.documentManager?.getDocument(uri);
        if (!existingDocument) {
            this.uriDoesNotExist(client, uri, request.id);
            return;
        }

        const fragment = existingDocument.getTextFragmentBeforePosition(position);
        if (fragment) {
            const filteredSymbols = existingDocument.getSymbolsByNamePrefix(fragment);

            const allKeywords = getKeywordsForLanguage(existingDocument.languageId);
            const filteredKeywods = allKeywords.filter(keyword =>
                keyword.label.startsWith(fragment));

            const completionItems: lsp.CompletionItem[] = [];
            // puts the matching keywords first, then the symbols by relevance
            completionItems.push(...filteredKeywods);

            for (const symbol of filteredSymbols) {
                completionItems.push({
                    label: symbol.symbol.name,
                    kind: lsp.CompletionItemKind.Variable,
                    detail: symbol.symbol.kind.toString(),
                    documentation: undefined,
                    insertText: symbol.symbol.name,
                    insertTextFormat: 1, // plain text
                });
            }

            client.postMessage(JSON.stringify(
                rpc.createSuccessResponse(request.id, completionItems)
            ));

        } else {
            // no symbol found, return empty completion list
            client.postMessage(JSON.stringify(
                rpc.createSuccessResponse(request.id, [])
            ));
        }
    }

    private async textDocument_highlight(client: Worker, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument.uri;
        const position = request.params.position;

        const existingDocument = this.documentManager?.getDocument(uri);
        if (!existingDocument) {
            this.uriDoesNotExist(client, uri, request.id);
            return;
        }

        const internal = existingDocument.getSymbolAroundPosition(position);
        if (!internal) {
            client.postMessage(JSON.stringify(
                rpc.createSuccessResponse(request.id, null)
            ));
            return;
        }

        // get all symbols with the same name
        const internalSymbols = existingDocument.getSymbolsByName(internal.symbol.name);

        // filter out declarations
        const highlights: lsp.DocumentHighlight[] = internalSymbols.map(s => ({
            range: s.symbol.location.range,
            kind: s.isDeclaration ? undefined : lsp.DocumentHighlightKind.Write
        }));

        client.postMessage(JSON.stringify(
            rpc.createSuccessResponse(request.id, highlights)
        ));
    }

    private async textDocument_references(client: Worker, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument.uri;
        const position = request.params.position;
        const includeDeclaration = request.params.context?.includeDeclaration ?? false;

        const existingDocument = this.documentManager?.getDocument(uri);
        if (!existingDocument) {
            this.uriDoesNotExist(client, uri, request.id);
            return;
        }

        const internal = existingDocument.getSymbolAroundPosition(position);
        if (!internal) {
            client.postMessage(JSON.stringify(
                rpc.createSuccessResponse(request.id, [])
            ));
            return;
        }

        // filter by declaration as required
        const internalSymbols = existingDocument.getSymbolsByName(internal.symbol.name);
        const filteredSymbols = internalSymbols.filter(s => includeDeclaration || !s.isDeclaration);

        client.postMessage(JSON.stringify(
            rpc.createSuccessResponse(request.id, filteredSymbols.map(s => ({
                uri: s.symbol.location.uri,
                range: s.symbol.location.range
            })))
        ));
    }

    private async textDocument_didOpen(client: Worker, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument.uri;
        const languageId = request.params.textDocument.languageId;
        const version = request.params.textDocument.version;
        const text = request.params.textDocument.text;

        // for simplicity, the language server ONLY checks the URI and document language upon opening

        if (!LanguageServer.validateDocumentUri(request)) {
            client.postMessage(JSON.stringify(
                rpc.createErrorResponse(
                    request.id, 
                    rpc.JSONRPC_ERRORS.INVALID_PARAMS.code, 
                    `Invalid document URI: ${uri}`
                )));
            return;
        }

        if (!LanguageServer.validateLanguage(languageId)) {
            client.postMessage(JSON.stringify(
                rpc.createErrorResponse(
                    request.id, 
                    rpc.JSONRPC_ERRORS.INVALID_PARAMS.code, 
                    `Unsupported language: ${languageId}`
                )));
            return;
        }

        let existingDocument = this.documentManager?.getDocument(uri);
        if (existingDocument) {
            // update the existing document only if the client version is newer
            if (version > existingDocument.version) {
                existingDocument.version = version;
                existingDocument.lines = text.split('\n');
                await this.requestCompleteRefresh(client, uri, existingDocument.lines);
            }
        } else {
            // did not exist, create a new document
            const newDocument = new doc.LSPDocument(uri, languageId, version);
            newDocument.lines = text.split('\n');
            // clears the symbols and diagnostics to empty
            newDocument.invalidateSymbols();
            this.documentManager?.createDocument(uri, newDocument);
            existingDocument = newDocument;
            await this.requestCompleteRefresh(client, uri, newDocument.lines);
        }

        // always the server's responsibility to report diagnostic data
        this.publishDiagnostics(client, existingDocument);
    }

    private textDocument_didChange(client: Worker, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument.uri;
        const version = request.params.textDocument.version;
        const contentChanges = request.params.contentChanges;

        const existingDocument = this.documentManager?.getDocument(uri);
        if (!existingDocument) {
            // document does not exist, cannot change it
            return;
        }

        if (version <= existingDocument.version) {
            // client is sending an older version, ignore
            return;
        }

        let lines = existingDocument.lines ?? [];

        for (const change of contentChanges) {
            if (change.range) {
                lines = existingDocument.applyTextEdit(lines, change.range, change.text);
            } else {
                // Full change: replace the whole text
                lines = change.text.split('\n');
            }
        }

        existingDocument.lines = lines;
        existingDocument.version = version;

        this.requestCompleteRefresh(client, uri, lines);
    }

    private textDocument_didClose(client: Worker, request: rpc.JSONRPCRequest) {
        // retains symbol and diagnostic data because the server must continue to 
        // be able to respond to symbol and diagnostic requests
        const uri = request.params.textDocument.uri;
        const existingDocument = this.documentManager?.getDocument(uri);
        if (existingDocument) {
            // purge document text only, will refresh upon re-open
            existingDocument.lines = [];
        }
    }

    private textDocument_didSave(client: Worker, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument.uri;

        let text: string | undefined = request.params.text;
        if (text) {
            // if the text is provided, it is the complete text of the document
            const existingDocument = this.documentManager?.getDocument(uri);
            if (existingDocument) {
                existingDocument.lines = text.split('\n');
            }
        }

        // if the text is not provided, the server has to assume it has the latest version already

        const existingLines = this.documentManager?.getDocument(uri)?.lines;
        if (existingLines) {
            this.requestCompleteRefresh(client, uri, existingLines);
        }
    }

    private textDocument_didChangeConfiguration(client: Worker, request: rpc.JSONRPCRequest) {
        // this should never arise in the Web context, but provide a meaningful error anyway
        this.sendMessageToClient(
            client, 
            'The client configuration has changed on disk. Please reload the editor to apply the new settings.', 
            lsp.MessageKind.Info);
    }

    private textDocument_didChangeWatchedFiles(client: Worker, request: rpc.JSONRPCRequest) {
        // this should never arise in the Web context, but provide a meaningful error anyway
        this.sendMessageToClient(
            client, 
            'One or more workspace files has been changed on disk. Please reload the document to prevent a loss of data.', 
            lsp.MessageKind.Info);
    }

    private textDocument_hover(client: Worker, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument;
        const position = request.params.position;

        const existingDocument = this.documentManager?.getDocument(uri);
        if (!existingDocument) {
            this.uriDoesNotExist(client, uri, request.id);
            return;
        }

        const hoveredInternal = existingDocument.getSymbolAroundPosition(position);
        if (hoveredInternal) {
            client.postMessage(JSON.stringify(
                rpc.createSuccessResponse(request.id, {
                    contents: hoveredInternal.symbol.name,
                    range: hoveredInternal.symbol.location.range
                })
            ));
        } else {
            client.postMessage(JSON.stringify(
                rpc.createSuccessResponse(request.id, null)
            ));
        }
    }

    // NOTE: NOT SUPPORTING PULL DIAGNOSTICS. RELY ON textDocument/publishDiagnostics INSTEAD.
    //private textDocument_diagnostic(client: Worker, request: rpc.JSONRPCRequest);

    /** Document-specific symbol search. Requires valid document identification. */
    private textDocument_documentSymbol(client: Worker, request: rpc.JSONRPCRequest) {
        const uri = request.params.textDocument.uri;

        const existingDocument = this.documentManager?.getDocument(uri);
        if (!existingDocument) {
            this.uriDoesNotExist(client, uri, request.id);
            return;
        }

        const symbols = existingDocument?.getAllSymbols();

        client.postMessage(JSON.stringify(
            rpc.createSuccessResponse(request.id, symbols)
        ));
    }

    /** Project-wide symbol search. Does not require a specific document URI. */
    private workspace_symbol(client: Worker, request: rpc.JSONRPCRequest) {
        const query = request.params.query;
        const queryResult: lsp.WorkspaceSymbol[] = [];
        
        for (const [uri, doc] of this.documentManager?.zipAllDocuments() || []) {
            for (const internal of doc.getAllSymbols()) {
                // empty == every symbol, otherwise LIKE (case-sensitive)
                if (query === "" || internal.symbol.name.includes(query)) {
                    queryResult.push(internal.symbol);
                }
            }
        }
    
        client.postMessage(JSON.stringify(
            rpc.createSuccessResponse(request.id, queryResult)
        ));
    }

    /////////////////////////////////////////////////////////
    
    /** Push complete document-wide diagnostic data to the connected client. Does not support pull-mode diagnostics. */
    private publishDiagnostics(client: Worker, document: doc.LSPDocument) {
        client.postMessage(JSON.stringify(
            rpc.createRequest("textDocument/publishDiagnostics", {
                uri: document.uri,
                version: document.version,
                // will automatically apply editor deltas to show relevant positioning
                diagnostics: document.getDiagnostics() || []
            }, crypto.randomUUID())));
    }

    /** Enqueue a new document diagnostic for recording. Does not send the information to the client */
    dispatchDiagnostic(uri: string, diagnostic: lsp.Diagnostic) {
        const existingDocument = this.documentManager?.getDocument(uri);
        if (!existingDocument) {
            if (this.client) {
                this.uriDoesNotExist(this.client, uri);
            }
            return;
        }

        // add the diagnostic to the document
        existingDocument.addDiagnostic(diagnostic);
    }

    /** Enqueue a new document symbol for processing. Handles translating and tracking the new symbol */
    dispatchSymbol(uri: string, symbol: doc.HazeSymbol) {
        const existingDocument = this.documentManager?.getDocument(uri);
        if (!existingDocument) {
            if (this.client) {
                this.uriDoesNotExist(this.client, uri);
            }
            return;
        }

        // add the symbol to the document
        existingDocument.upsertSymbol(symbol);
    }

    /** Record a new message string with the specified kind. Logs on both the client and server side. */
    logMessage(message: string, kind: lsp.MessageKindType = lsp.MessageKind.Log) {
        if (this.client) {
            this.sendLogToClient(this.client, message, kind);
        } 
        // dispatches the corresponding print type
        logMessage(message, kind);
    }

    /** Request a full re-compile of the current document [set]. */
    private async requestCompleteRefresh(client: Worker, uri: string, linesOptional?: string[], requestId?: rpc.JSONRPCID) {
        const existingDocument = this.documentManager?.getDocument(uri);
        if (!existingDocument) {
            this.uriDoesNotExist(client, uri, requestId);
            return;
        }
        
        let lines = linesOptional || existingDocument.lines;
        existingDocument.lines = lines;

        await this.compilerDriver?.requestCompile(lines);
        // NOTE: diagnostics will only refresh as often as the document fully recompiles
        this.publishDiagnostics(client, existingDocument);
    }
    
    /** Send a message of specified kind and text to the connected client. */
    private sendMessageToClient(client: Worker, message: string, kind: lsp.MessageKindType = lsp.MessageKind.Info) {
        client.postMessage(JSON.stringify(
            rpc.createRequest("window/showMessage", {
                type: kind,
                message: message
                // not support action items for now
            }, crypto.randomUUID())));
    }

    /** Send an invisible text message to the connected client for logging. */
    private sendLogToClient(client: Worker, message: string, kind: lsp.MessageKindType = lsp.MessageKind.Log) {
        client.postMessage(JSON.stringify(
            rpc.createRequest("window/logMessage", {
                type: kind,
                message: message
            }, crypto.randomUUID())));
    }

    /** Error-notify the connected client that the server has no active information about a specified document. */
    private uriDoesNotExist(client: Worker, uri: string, requestId?: rpc.JSONRPCID) {
        client.postMessage(JSON.stringify(
            rpc.createErrorResponse(
                requestId || null,
                rpc.JSONRPC_ERRORS.INVALID_PARAMS.code, 
                rpc.JSONRPC_ERRORS.INVALID_PARAMS.message + `Document with URI ${uri} not found`
            )));
    }

    /////////////////////////////////////////////////////////

    private static validateLanguage(languageId: string): boolean {
        const acceptableLanguages = ['haze', 'hazes', 'hazei'];
        return acceptableLanguages.includes(languageId);
    }

    private static validateDocumentUri(request: rpc.JSONRPCRequest): boolean {
        const uri = request.params.textDocument.uri;
        if (!uri || typeof uri !== 'string') {
            return false;
        }
        // NOTE: since the web language server client does not access the file system, it makes more sense to just
        // pass whatever the user has named each document as the URI rather than faking a resource. Thus the file://
        // checks would fail. Commenting this check out for now.
        //if (!uri.startsWith('file://')) {
        //    return false;
        //}
        return true;
    }    
}