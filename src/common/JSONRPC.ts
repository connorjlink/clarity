export type JSONRPCID = string | number | null;

export interface JSONRPCRequest {
    jsonrpc: "2.0";
    id: JSONRPCID;
    method: string;
    params?: any;
}

export interface JSONRPCResponse {
    jsonrpc: "2.0";
    result?: any;
    error?: JSONRPCError;
    id: JSONRPCID;
}

export interface JSONRPCError {
    code: number;
    message: string;
    data?: any;
}

export function createRequest(
    method: string,
    params?: any,
    id: JSONRPCID = null
): JSONRPCRequest {
    return {
        jsonrpc: "2.0",
        method,
        params,
        id,
    };
}

export function createSuccessResponse(
    id: JSONRPCID,
    result: any
): JSONRPCResponse {
    return {
        jsonrpc: "2.0",
        result,
        id,
    };
}

export function createErrorResponse(
    id: JSONRPCID,
    code: number,
    message: string,
    data?: any
): JSONRPCResponse {
    return {
        jsonrpc: "2.0",
        error: { code, message, data },
        id,
    };
}

// standard JSON-RPC error codes https://www.jsonrpc.org/specification#response_object
export const JSONRPC_ERRORS = {
    PARSE_ERROR: { code: -32700, message: "Parse error" },
    INVALID_REQUEST: { code: -32600, message: "Invalid Request" },
    METHOD_NOT_FOUND: { code: -32601, message: "Method not found" },
    INVALID_PARAMS: { code: -32602, message: "Invalid params" },
    INTERNAL_ERROR: { code: -32603, message: "Internal error" },
    SERVER_NOT_INITIALIZED: { code: -32002, message: "Server not initialized" },
};
