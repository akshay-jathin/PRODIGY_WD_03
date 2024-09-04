document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const status = document.querySelector('.status');
    const resetButton = document.getElementById('reset');
    const indexButton = document.getElementById('index');
    const messageBox = document.querySelector('.message-box');
    let currentPlayer = Math.random() < 0.5 ? 'X' : 'O';

    updateStatus();

    cells.forEach(cell => {
        cell.addEventListener('click', handleClick);
    });

    resetButton.addEventListener('click', resetGame);
    indexButton.addEventListener('click', () => window.location.href = 'index.html');

    function handleClick(event) {
        const cell = event.target;
        if (cell.textContent === '') {
            cell.textContent = currentPlayer;
            if (checkWinner()) {
                displayMessage(`${currentPlayer} wins!`);
                cells.forEach(cell => cell.removeEventListener('click', handleClick));
            } else if (Array.from(cells).every(cell => cell.textContent !== '')) {
                displayMessage('It\'s a draw!');
            }
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus();
        }
    }

    function updateStatus() {
        status.textContent = `Player ${currentPlayer}'s Turn`;
        const playerColor = currentPlayer === 'X' ? 'rgba(255, 182, 193, 0.5)' : 'rgba(128, 0, 128, 0.2)';
        document.querySelectorAll('.cell').forEach(cell => {
            cell.style.backgroundColor = playerColor;
        });
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

    function resetGame() {
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
        updateStatus();
        cells.forEach(cell => cell.addEventListener('click', handleClick));
        messageBox.style.display = 'none';
    }

    function displayMessage(message) {
        messageBox.textContent = message;
        messageBox.style.display = 'block';
    }
});
