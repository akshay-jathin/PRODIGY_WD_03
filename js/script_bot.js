document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const status = document.querySelector('.status');
    const resetButton = document.getElementById('reset');
    const indexButton = document.getElementById('index');
    const messageBox = document.querySelector('.message-box');
    let currentPlayer = 'X';

    updateStatus();

    cells.forEach(cell => {
        cell.addEventListener('click', handleClick);
    });

    resetButton.addEventListener('click', resetGame);
    indexButton.addEventListener('click', () => window.location.href = 'index.html');

    function handleClick(event) {
        const cell = event.target;
        if (cell.textContent === '' && currentPlayer === 'X') {
            cell.textContent = currentPlayer;
            if (checkWinner()) {
                displayMessage(`${currentPlayer} wins!`);
                cells.forEach(cell => cell.removeEventListener('click', handleClick));
            } else if (Array.from(cells).every(cell => cell.textContent !== '')) {
                displayMessage('It\'s a draw!');
            } else {
                currentPlayer = 'O';
                updateStatus();
                makeBotMove();
            }
        }
    }

    function makeBotMove() {
        const boardState = Array.from(cells).map(cell => cell.textContent || '');
        const botMove = minimax(boardState, 'O').index;
        cells[botMove].textContent = 'O';

        if (checkWinner()) {
            displayMessage('O wins!');
            cells.forEach(cell => cell.removeEventListener('click', handleClick));
        } else if (boardState.every(cell => cell !== '')) {
            displayMessage('It\'s a draw!');
        } else {
            currentPlayer = 'X';
            updateStatus();
        }
    }

    function minimax(newBoard, player) {
        const availSpots = newBoard.reduce((acc, cell, index) => 
            cell === '' ? acc.concat(index) : acc, []);

        if (checkWinnerMinimax(newBoard, 'X')) {
            return { score: -10 };
        } else if (checkWinnerMinimax(newBoard, 'O')) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];
            newBoard[availSpots[i]] = player;

            if (player === 'O') {
                const result = minimax(newBoard, 'X');
                move.score = result.score;
            } else {
                const result = minimax(newBoard, 'O');
                move.score = result.score;
            }

            newBoard[availSpots[i]] = '';
            moves.push(move);
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return cells[a].textContent && 
                   cells[a].textContent === cells[b].textContent && 
                   cells[a].textContent === cells[c].textContent;
        });
    }

    function checkWinnerMinimax(board, player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] === player && board[b] === player && board[c] === player;
        });
    }

    function resetGame() {
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = 'X'; // Reset to X
        updateStatus();
        cells.forEach(cell => cell.addEventListener('click', handleClick));
        messageBox.style.display = 'none';
    }

    function displayMessage(message) {
        messageBox.textContent = message;
        messageBox.style.display = 'block';
    }

    function updateStatus() {
        status.textContent = `Player ${currentPlayer}'s Turn`;
        const playerColor = currentPlayer === 'X' ? 'rgba(255, 182, 193, 0.5)' : 'rgba(128, 0, 128, 0.2)';
        document.querySelectorAll('.cell').forEach(cell => {
            cell.style.backgroundColor = playerColor;
        });
    }
});
