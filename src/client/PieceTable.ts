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
        this.pieces = [{ buffer: 'original', start: 0, length: initialText.length }];
    }   

    insert(position: number, text: string) {
        if (text.length === 0) {
            return;    
        }
        const addStart = this.addBuffer.length;
        this.addBuffer += text;   
        let offset = 0;
        let i = 0;    
    
        // find the piece containing the insert position
        for (; i < this.pieces.length; i++) {
            const piece = this.pieces[i];
            if (offset + piece.length >= position) {
                break;
            }
            offset += piece.length;
        }   
    
        // the position is at the end, the table requires appending a new piece
        if (i === this.pieces.length) {
            this.pieces.push({
                buffer: 'add',
                start: addStart,
                length: text.length
            });
            return;
        }
    
        const piece = this.pieces[i];
        const withinPieceOffset = position - offset;    
        const newPieces: Piece[] = [];    
        if (withinPieceOffset > 0) {
            // left part of original piece
            newPieces.push({
                buffer: piece.buffer,
                start: piece.start,
                length: withinPieceOffset
            });
        }   
        // insert text as new piece
        newPieces.push({
            buffer: 'add',
            start: addStart,
            length: text.length
        });   
        if (withinPieceOffset < piece.length) {
            // right part of original piece
            newPieces.push({
                buffer: piece.buffer,
                start: piece.start + withinPieceOffset,
                length: piece.length - withinPieceOffset
            });
        }   
        // splice in affected piece
        this.pieces.splice(i, 1, ...newPieces);
    }      

    delete(position: number, length: number) {
        let offset = 0;
        let i = 0;    
        while (i < this.pieces.length && offset + this.pieces[i].length <= position) {
            offset += this.pieces[i].length;
            i++;
        }   

        const startIndex = i;
        const deleteStartOffset = position - offset;   
        let deleteLength = length;
        const newPieces: Piece[] = [];    
        while (deleteLength > 0 && i < this.pieces.length) {
            const piece = this.pieces[i];
            const pieceStart = (i === startIndex) ? deleteStartOffset : 0;
            const pieceLength = piece.length - pieceStart;
            const keepLength = Math.max(0, piece.length - pieceLength);   
            if (pieceStart > 0) {
                newPieces.push({
                    buffer: piece.buffer,
                    start: piece.start,
                    length: pieceStart
                });
            }   
            if (pieceLength < piece.length) {
                newPieces.push({
                    buffer: piece.buffer,
                    start: piece.start + pieceStart + deleteLength,
                    length: piece.length - (pieceStart + deleteLength)
                });
            }   
            deleteLength -= pieceLength;
            i++;
        }   

        this.pieces.splice(startIndex, i - startIndex, ...newPieces);
    }   

    getText(): string {
        let result = '';
        for (const piece of this.pieces) {
            const buffer = piece.buffer === 'original' ? this.original : this.addBuffer;
            result += buffer.substr(piece.start, piece.length);
        }
        return result;
    }
}
