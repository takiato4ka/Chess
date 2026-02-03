import { onBoard } from './utils.js';

class Piece {
    constructor(color, type) {
        this.color = color;
        this.type = type;
    }

    getStandardMoves(r, c, board, directions, isSingleStep = false) {
        const moves = [];
        directions.forEach(([dr, dc]) => {
            let nr = r + dr, nc = c + dc;
            while (onBoard(nr, nc)) {
                const target = board[nr][nc];
                if (!target) {
                    moves.push({ r: nr, c: nc });
                    if (isSingleStep) break;
                } else {
                    if (target.color !== this.color) moves.push({ r: nr, c: nc, capture: true });
                    break;
                }
                nr += dr; nc += dc;
            }
        });
        return moves;
    }
}

export class Pawn extends Piece {
    constructor(color) { super(color, 'pawn'); }
    getValidMoves(r, c, board) {
        const moves = [];
        const dir = this.color === 'white' ? -1 : 1;
        if (onBoard(r + dir, c) && !board[r + dir][c]) {
            moves.push({ r: r + dir, c: c });
            const startRow = this.color === 'white' ? 6 : 1;
            if (r === startRow && !board[r + 2 * dir][c]) moves.push({ r: r + 2 * dir, c: c });
        }
        [[dir, 1], [dir, -1]].forEach(([dr, dc]) => {
            const nr = r + dr, nc = c + dc;
            if (onBoard(nr, nc) && board[nr][nc] && board[nr][nc].color !== this.color) {
                moves.push({ r: nr, c: nc, capture: true });
            }
        });
        return moves;
    }
}

export class Knight extends Piece {
    constructor(color) { super(color, 'knight'); }
    getValidMoves(r, c, board) {
        const dirs = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
        return this.getStandardMoves(r, c, board, dirs, true);
    }
}

export class Bishop extends Piece {
    constructor(color) { super(color, 'bishop'); }
    getValidMoves(r, c, board) {
        return this.getStandardMoves(r, c, board, [[1,1],[1,-1],[-1,1],[-1,-1]]);
    }
}

export class Rook extends Piece {
    constructor(color) { super(color, 'rook'); }
    getValidMoves(r, c, board) {
        return this.getStandardMoves(r, c, board, [[0,1],[0,-1],[1,0],[-1,0]]);
    }
}

export class Queen extends Piece {
    constructor(color) { super(color, 'queen'); }
    getValidMoves(r, c, board) {
        return this.getStandardMoves(r, c, board, [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]);
    }
}

export class King extends Piece {
    constructor(color) { super(color, 'king'); }
    getValidMoves(r, c, board) {
        return this.getStandardMoves(r, c, board, [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]], true);
    }
}
