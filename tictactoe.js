const playButton = document.getElementById('play-button');
const submitNamesButton = document.getElementById('submit-names');
const nameModal = document.getElementById('player-names');
const playerOneScore = document.getElementById('player-one-score');
const playerTwoScore = document.getElementById('player-two-score');
const messages = document.getElementById('messages');

playButton.addEventListener('click', () => {
    nameModal.showModal();
});

submitNamesButton.addEventListener('click', () => {
    const players = submitNames();
    nameModal.close();
    play(players[0], players[1]);
});

function submitNames() {
    const playerOneInput = document.getElementById('player-one');
    const playerTwoInput = document.getElementById('player-two');
    const playerOneName = playerOneInput.value;
    const playerTwoName = playerTwoInput.value;
    const playerOne = makePlayer(playerOneName, 'X');
    const playerTwo = makePlayer(playerTwoName, 'O');
    const players = [playerOne, playerTwo];
    return players;
}

function play(playerOne, playerTwo) {
    const boardContainer = document.getElementById('board-container');
    let board = setup(boardContainer);

    updateScore(playerOne, playerTwo);
    resetMessage();
    playerOne.swapTurn();
    let currentPlayer;

    boardContainer.addEventListener('click', () => {
        const clicked = event.target;
        currentPlayer = getPlayer(playerOne, playerTwo);
        if (clicked.classList.contains('blank')) {
            resetMessage();
            clicked.classList.remove('blank');
            clicked.classList.add(currentPlayer.symbol);
            clicked.textContent = currentPlayer.symbol;
            
            if(checkForWin(currentPlayer, board)) {
                resetGame();
            } else {
                tradeTurns(playerOne, playerTwo);
            }
            
        } else {
            messages.textContent = 'That space is taken.'
        }
        
        
    });


}

function setup(board) {
    let arr = []
    
    for (let i = 0; i < 9; i++) {
        const tile = makeTile(i);
        const div = makeDiv(tile[0], tile[1]);
        board.append(div);

        arr.push({id: div.id, symbol: ''});
    }

    return arr;
}

function makeTile(num) {
    const column = num % 3;
    const row = Math.floor(num / 3);
    const newTile = [column, row]
    return newTile;
}

function makeDiv(column, row) {
    const newDiv = document.createElement('div');
    newDiv.id = `c${column}r${row}`;
    newDiv.classList.add('blank');
    return newDiv;
}

function makePlayer(name, symbol) {
    let wins = 0;
    let losses = 0;
    let turn = false;
    const getWins = () => wins;
    const getLosses = () => losses;
    const getTurn = () => turn;
    const increaseWins = () => { wins++; };
    const increaseLosses = () => { losses++; };
    const swapTurn = () => { turn = !turn }
    return { name, symbol, getWins, getLosses, getTurn, increaseWins, increaseLosses,  swapTurn };
}

function Square(id, symbol) {
    this.id = id;
    this.symbol = symbol;
}

function getPlayer(playerOne, playerTwo) {
    if (playerOne.getTurn() === playerTwo.getTurn()) {
        console.log('Players have the same turn.')
    } else if (playerOne.getTurn()) {
        return playerOne;
    } else if (playerTwo.getTurn()) {
        return playerTwo;
    } else console.log("It is neither player's turn?");
}

function tradeTurns(playerOne, playerTwo) {
    playerOne.swapTurn();
    playerTwo.swapTurn();
}

function updateScore(playerOne, playerTwo) {
    playerOneScore.textContent = `${playerOne.name}: ${playerOne.getWins()}`;
    playerTwoScore.textContent = `${playerTwo.name}: ${playerTwo.getWins()}`;
}

function resetMessage() {
    messages.textContent = 'I want a good clean match'
}

function updateBoard(board) {

}

function checkForWin(player, board) {
    for (div of board) {
        console.log(board.id);
    }
}