import { PIECE_SYMBOLS } from './utils.js';

export class Board {
    constructor(elementId, onCellClick) {
        this.element = document.getElementById(elementId);
        this.onCellClick = onCellClick;
    }

    render(boardData, selected, validMoves, checkPos) {
        this.element.innerHTML = '';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const cell = document.createElement('div');
                cell.className = `cell ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
                
                const piece = boardData[r][c];
                if (piece) {
                    cell.textContent = PIECE_SYMBOLS[piece.color][piece.type];
                    cell.classList.add(piece.color === 'white' ? 'white-piece' : 'black-piece');
                    if (piece.type === 'king' && checkPos && checkPos.r === r && checkPos.c === c) {
                        cell.classList.add('check');
                    }
                }

                if (selected && selected.r === r && selected.c === c) cell.classList.add('selected');
                
                const move = validMoves.find(m => m.r === r && m.c === c);
                if (move) cell.classList.add(move.capture ? 'possible-capture' : 'possible-move');

                cell.onclick = () => this.onCellClick(r, c);
                this.element.appendChild(cell);
            }
        }
    }
}
