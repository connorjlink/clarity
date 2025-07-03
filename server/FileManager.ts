import fs from 'fs/promises';

export async function readFileAsHex(path: string): Promise<any[]> {
    try {
        const buffer = await fs.readFile(path);
        // e.g., [0x1a, 0x2b, 0x3c]
        return Array.from(buffer)
            .map(byte => byte.toString(16).toUpperCase().padStart(2, '0'));

    } catch (err) {
        throw new Error(`Failed to read file as hex: ${err}`);
    }
}

export async function readFile(path: string): Promise<string> {
    try {
        const data = await fs.readFile(path);
        return data.toString('utf-8');
    } catch (err) {
        throw new Error(`Failed to read file from URI: ${err}`);
    }
}
