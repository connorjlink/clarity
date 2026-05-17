type BufferType = 'original' | 'add';

interface Piece {
    buffer: BufferType;
    start: number;
    length: number;
}

export class PieceTable {
    private original: string;
    private addBuffer: string;
    private pieces: Piece[];

    constructor(initialText: string) {
        this.original = initialText;
        this.addBuffer = '';
        this.pieces = [];
        const lines = initialText.split('\n');
        let offset = 0;
        for (const line of lines) {
            this.pieces.push({
                buffer: 'original',
                start: offset,
                length: line.length
            });
            // +1 for '\n'
            offset += line.length + 1;
        }
    }

    getLines(): string[] {
        const lines: string[] = [];
        for (const piece of this.pieces) {
            const buffer = piece.buffer === 'original' ? this.original : this.addBuffer;
            lines.push(buffer.substr(piece.start, piece.length));
        }
        return lines;
    }

    getText(): string {
        return this.getLines().join('\n');
    }

    insertLine(index: number, line: string) {
        const addStart = this.addBuffer.length;
        this.addBuffer += line;
        const newPiece: Piece = {
            buffer: 'add',
            start: addStart,
            length: line.length
        };
        this.pieces.splice(index, 0, newPiece);
    }

    deleteLine(index: number) {
        if (index >= 0 && index < this.pieces.length) {
            this.pieces.splice(index, 1);
        }
    }

    replaceLine(index: number, line: string) {
        if (index < 0 || index >= this.pieces.length) {
            return;
        }
        const addStart = this.addBuffer.length;
        this.addBuffer += line;
        this.pieces[index] = {
            buffer: 'add',
            start: addStart,
            length: line.length
        };
    }

    setLines(lines: string[]) {
        this.pieces = [];
        this.addBuffer = '';
        for (const line of lines) {
            const addStart = this.addBuffer.length;
            this.addBuffer += line;
            this.pieces.push({
                buffer: 'add',
                start: addStart,
                length: line.length
            });
        }
    }
}