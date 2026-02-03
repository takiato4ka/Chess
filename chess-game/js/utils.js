export const PIECE_SYMBOLS = {
    white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
    black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
};

export function onBoard(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

export function toChessNotation(r, c) {
    return String.fromCharCode(97 + c) + (8 - r);
}
