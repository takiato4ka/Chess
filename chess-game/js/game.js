import { Board } from './board.js';
import * as Pieces from './pieces.js';

class Game {
    constructor() {
        this.boardData = Array(8).fill(null).map(() => Array(8).fill(null));
        this.turn = 'white';
        this.selected = null;
        this.validMoves = [];
        this.gameOver = false;
        
        this.boardView = new Board('board', (r, c) => this.handleCellClick(r, c));
        this.init();
    }

    init() {
        this.setupInitialPosition();
        this.updateUI();
        document.getElementById('restart-btn').onclick = () => location.reload();
    }

    setupInitialPosition() {
        const layout = [Pieces.Rook, Pieces.Knight, Pieces.Bishop, Pieces.Queen, Pieces.King, Pieces.Bishop, Pieces.Knight, Pieces.Rook];
        for (let i = 0; i < 8; i++) {
            this.boardData[0][i] = new layout[i]('black');
            this.boardData[1][i] = new Pieces.Pawn('black');
            this.boardData[6][i] = new Pieces.Pawn('white');
            this.boardData[7][i] = new layout[i]('white');
        }
    }

    handleCellClick(r, c) {
        if (this.gameOver) return;
        const move = this.validMoves.find(m => m.r === r && m.c === c);
        
        if (move) {
            this.executeMove(this.selected.r, this.selected.c, r, c);
        } else if (this.boardData[r][c]?.color === this.turn) {
            this.selected = { r, c };
            this.validMoves = this.getLegalMoves(r, c);
        } else {
            this.selected = null;
            this.validMoves = [];
        }
        this.updateUI();
    }

    executeMove(fr, fc, tr, tc) {
        this.boardData[tr][tc] = this.boardData[fr][fc];
        this.boardData[fr][fc] = null;
        this.turn = this.turn === 'white' ? 'black' : 'white';
        this.selected = null;
        this.validMoves = [];
        this.checkGameState();
    }

    getLegalMoves(r, c) {
        const piece = this.boardData[r][c];
        const raw = piece.getValidMoves(r, c, this.boardData);
        return raw.filter(m => {
            const temp = this.boardData[m.r][m.c];
            this.boardData[m.r][m.c] = piece;
            this.boardData[r][c] = null;
            const safe = !this.isKingInCheck(piece.color);
            this.boardData[r][c] = piece;
            this.boardData[m.r][m.c] = temp;
            return safe;
        });
    }

    isKingInCheck(color) {
        let king = null;
        for (let r = 0; r < 8; r++)
            for (let c = 0; c < 8; c++)
                if (this.boardData[r][c]?.type === 'king' && this.boardData[r][c]?.color === color) king = { r, c };
        
        const enemy = color === 'white' ? 'black' : 'white';
        for (let r = 0; r < 8; r++)
            for (let c = 0; c < 8; c++)
                if (this.boardData[r][c]?.color === enemy) {
                    if (this.boardData[r][c].getValidMoves(r, c, this.boardData).some(m => m.r === king.r && m.c === king.c)) return true;
                }
        return false;
    }

    checkGameState() {
        const hasMoves = this.boardData.some((row, r) => row.some((p, c) => p?.color === this.turn && this.getLegalMoves(r, c).length > 0));
        if (!hasMoves) {
            this.gameOver = true;
            alert(this.isKingInCheck(this.turn) ? "Мат!" : "Пат!");
        }
    }

    updateUI() {
        const checkPos = this.isKingInCheck(this.turn) ? this.findKing(this.turn) : null;
        this.boardView.render(this.boardData, this.selected, this.validMoves, checkPos);
        document.getElementById('status').textContent = `Ход ${this.turn === 'white' ? 'Белых' : 'Черных'}`;
    }

    findKing(color) {
        for (let r = 0; r < 8; r++)
            for (let c = 0; c < 8; c++)
                if (this.boardData[r][c]?.type === 'king' && this.boardData[r][c]?.color === color) return { r, c };
    }
}

new Game();
