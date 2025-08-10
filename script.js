const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const pvpBtn = document.getElementById('pvp');
const pvcBtn = document.getElementById('pvc');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameMode = 'pvp'; // 'pvp' or 'pvc'

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Initialize the game
function initGame() {
    cells.forEach(cell => {
        cell.classList.remove('x', 'o', 'winner');
        cell.textContent = '';
    });
    
    gameState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = 'X';
    gameActive = true;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    statusText.style.color = '';
}

// Handle cell click
function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (gameState[index] !== "" || !gameActive) return;

    // Player move
    makeMove(index, currentPlayer);
    
    // Check for winner
    if (checkWinner()) {
        statusText.textContent = `Player ${currentPlayer} wins! 🎉`;
        statusText.style.color = currentPlayer === 'X' ? 'var(--primary)' : 'var(--success)';
        highlightWinningCells();
        gameActive = false;
        return;
    }

    // Check for draw
    if (!gameState.includes("")) {
        statusText.textContent = "Game ended in a draw!";
        gameActive = false;
        return;
    }

    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    // Computer move if in PVC mode and it's computer's turn
    if (gameMode === 'pvc' && currentPlayer === 'O' && gameActive) {
        setTimeout(computerMove, 500);
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
}

function computerMove() {
    if (!gameActive) return;

    // Simple AI: first try to win, then block, then random
    let move = findWinningMove('O') || findWinningMove('X') || findRandomMove();
    
    if (move !== null) {
        makeMove(move, 'O');
        
        if (checkWinner()) {
            statusText.textContent = 'Computer wins! 🤖';
            statusText.style.color = 'var(--success)';
            highlightWinningCells();
            gameActive = false;
            return;
        }

        if (!gameState.includes("")) {
            statusText.textContent = "Game ended in a draw!";
            gameActive = false;
            return;
        }

        currentPlayer = 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function findWinningMove(player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        // Check if two in a row with one empty
        if (gameState[a] === player && gameState[b] === player && gameState[c] === "") return c;
        if (gameState[a] === player && gameState[c] === player && gameState[b] === "") return b;
        if (gameState[b] === player && gameState[c] === player && gameState[a] === "") return a;
    }
    return null;
}

function findRandomMove() {
    const availableMoves = gameState
        .map((cell, index) => cell === "" ? index : null)
        .filter(val => val !== null);
    
    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    return null;
}

function checkWinner() {
    return winningConditions.some(condition => {
        const [a, b, c] = condition;
        return gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });
}

function highlightWinningCells() {
    const winningCondition = winningConditions.find(condition => {
        const [a, b, c] = condition;
        return gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
    });

    if (winningCondition) {
        winningCondition.forEach(index => {
            document.querySelector(`[data-index="${index}"]`).classList.add('winner');
        });
    }
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', initGame);

pvpBtn.addEventListener('click', () => {
    gameMode = 'pvp';
    pvpBtn.classList.add('active');
    pvcBtn.classList.remove('active');
    initGame();
});

pvcBtn.addEventListener('click', () => {
    gameMode = 'pvc';
    pvcBtn.classList.add('active');
    pvpBtn.classList.remove('active');
    initGame();
});

// Initialize the game
initGame();