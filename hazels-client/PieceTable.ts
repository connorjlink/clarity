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
    if (text.length === 0) return;

    const addStart = this.addBuffer.length;
    this.addBuffer += text;

    let offset = 0;
    let i = 0;

    // Find the piece index where the insertion happens
    for (; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (offset + piece.length >= position) break;
      offset += piece.length;
    }

    const piece = this.pieces[i];
    const withinPieceOffset = position - offset;

    const newPieces: Piece[] = [];

    if (withinPieceOffset > 0) {
      // Left part of original piece
      newPieces.push({
        buffer: piece.buffer,
        start: piece.start,
        length: withinPieceOffset
      });
    }

    // Inserted text as new piece
    newPieces.push({
      buffer: 'add',
      start: addStart,
      length: text.length
    });

    if (withinPieceOffset < piece.length) {
      // Right part of original piece
      newPieces.push({
        buffer: piece.buffer,
        start: piece.start + withinPieceOffset,
        length: piece.length - withinPieceOffset
      });
    }

    // Replace affected piece
    this.pieces.splice(i, 1, ...newPieces);
  }

  delete(position: number, length: number) {
    let offset = 0;
    let i = 0;

    while (i < this.pieces.length && offset + this.pieces[i].length <= position) {
      offset += this.pieces[i].length;
      i++;
    }

    const startIdx = i;
    const delStartOffset = position - offset;

    let delLen = length;
    const newPieces: Piece[] = [];

    while (delLen > 0 && i < this.pieces.length) {
      const piece = this.pieces[i];
      const pieceStart = (i === startIdx) ? delStartOffset : 0;
      const pieceLen = piece.length - pieceStart;
      const keepLen = Math.max(0, piece.length - pieceLen);

      if (pieceStart > 0) {
        newPieces.push({
          buffer: piece.buffer,
          start: piece.start,
          length: pieceStart
        });
      }

      if (pieceLen < piece.length) {
        newPieces.push({
          buffer: piece.buffer,
          start: piece.start + pieceStart + delLen,
          length: piece.length - (pieceStart + delLen)
        });
      }

      delLen -= pieceLen;
      i++;
    }

    this.pieces.splice(startIdx, i - startIdx, ...newPieces);
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
