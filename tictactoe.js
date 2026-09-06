const submitNamesButton = document.getElementById('submit-names');
const nameModal = document.getElementById('player-names');
const playerOneContainer = document.getElementById('player-one-container');
const playerTwoContainer = document.getElementById('player-two-container');
const boardContainer = document.getElementById('board-container');
const messages = document.getElementById('messages');
const newGame= document.getElementById('new-game');
let gameStarted = false;
let firstGame = true;
// playButton.addEventListener('click', openModal);

newGame.addEventListener('click', function(event) {
    event.preventDefault();

    if(firstGame) openModal();
});

function openModal() {
    nameModal.showModal();

    submitNamesButton.addEventListener('click', () => {
        const players = submitNames();
        nameModal.close();
        
        play(players[0], players[1]);
    });
}

function submitNames() {
    const playerOneInput = document.getElementById('player-one');
    const playerTwoInput = document.getElementById('player-two');
    const playerOneName = playerOneInput.value;
    const playerTwoName = playerTwoInput.value;
    const playerOne = makePlayer(playerOneName, 'X');
    const playerTwo = makePlayer(playerTwoName, 'O');
    const players = [playerOne, playerTwo];

    const playerOneNameP = document.createElement('p');
    const playerTwoNameP = document.createElement('p');
    const playerOneScoreP = document.createElement('p');
    const playerTwoScoreP = document.createElement('p');
    playerOneNameP.id = 'p1-name';
    playerTwoNameP.id = 'p2-name';
    playerOneScoreP.id = 'p1-score';
    playerTwoScoreP.id = 'p2-score';
    playerOneNameP.textContent = `${playerOne.name}:`;
    playerTwoNameP.textContent = `${playerTwo.name}:`;
    playerOneScoreP.textContent = playerOne.getWins();
    playerTwoScoreP.textContent = playerTwo.getWins();
    playerOneContainer.append(playerOneNameP, playerOneScoreP);
    playerTwoContainer.append(playerTwoNameP, playerTwoScoreP);

    return players;
}

function play(playerOne, playerTwo) {
    firstGame = false;
    gameStarted = true;
    let board = setup(boardContainer);
    console.log(board)
    updateScore(playerOne, playerTwo);
    resetMessage();
    playerOne.swapTurn();
    playerOneContainer.classList.add('active');
    let currentPlayer;
    let squaresLeft = 9;

    newGame.addEventListener('click', function(event) {
        event.preventDefault();
        if(!gameStarted) {
            board = resetGame(boardContainer);
            gameStarted = true;
            resetMessage();
            if(playerOne.getTurn()) {
                playerOneContainer.classList.add('active');
                playerTwoContainer.classList.remove('active');
            } else {
                tradeTurns(playerOne, playerTwo);
            }
        }
    });

    boardContainer.addEventListener('click', () => {
        const clicked = event.target;
        currentPlayer = getPlayer(playerOne, playerTwo);
        if (clicked.classList.contains('blank')) {
            if (gameStarted) {
                let clickedSquare = board.find(sq => sq.id == clicked.id);
                clickedSquare.markSquare(currentPlayer.symbol)
                resetMessage();
                clicked.classList.remove('blank');
                clicked.classList.add(currentPlayer.symbol);
                clicked.textContent = currentPlayer.symbol;
                squaresLeft--;

                if(checkForWin(currentPlayer, board, clickedSquare.column, clickedSquare.row)) {
                    gameStarted = false;
                    messages.textContent = `${currentPlayer.name} wins!`;
                    squaresLeft = 9;
                    currentPlayer.increaseWins();
                    updateScore(playerOne, playerTwo);
                    
                    /* THIS NEEDS TO CHANGE BECAUSE I 
                    ELIMINATED THE PLAY BUTTON

                    playButton.addEventListener('click', () => {
                        board = resetGame(boardContainer);
                    }); */

                    
                } else if (squaresLeft == 0) {
                    gameStarted = false;
                    messages.textContent = 'Draw.';
                    squaresLeft = 9;

                } else {
                    tradeTurns(playerOne, playerTwo);
                }
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
        const square = new Square(div.id, '')
        arr.push(square);
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
    newDiv.classList.add('square');
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
    const idToChar = id.split('');
    this.column = idToChar[1];
    this.row = idToChar[3];
    this.markSquare = function(sym) {
        this.symbol = sym;
    }
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
    console.log(playerOne.getTurn())
    if(playerOne.getTurn()) {
        playerOneContainer.classList.remove('active');
        playerTwoContainer.classList.add('active');
    } else {
        playerOneContainer.classList.add('active');
        playerTwoContainer.classList.remove('active');
    }
    playerOne.swapTurn();
    playerTwo.swapTurn();
}

function updateScore(playerOne, playerTwo) {
    const playerOneScore = document.getElementById('p1-score');
    const playerTwoScore = document.getElementById('p2-score');
    playerOneScore.textContent = `${playerOne.getWins()}`;
    playerTwoScore.textContent = `${playerTwo.getWins()}`;
}

function resetMessage() {
    messages.textContent = 'I want a good clean match'
}

function checkForWin(player, board, column, row) {
    let won = false;
   
    won = checkColumn(board, column, player.symbol);

    if(!won) {
        won = checkRow(board, row, player.symbol);
    }

    if(!won) {
        won = checkLeftDiagonal(board, player.symbol);
    }

    if(!won) {
        won = checkRightDiagonal(board, player.symbol);
    }

    return won;
}

function checkColumn(board, checkedColumn, symbol) {
    let count = 0;
    for(square of board) {
        if (square.column == checkedColumn && square.symbol == symbol) {
            count++
        } 
    }
    if (count == 3) return true;
    else return false;
}

function checkRow(board, checkedRow, symbol) {
    let count = 0;
    for(square of board) {
        if (square.row == checkedRow && square.symbol == symbol) {
            count++
        } 
    }
    if (count == 3) return true;
    else return false;
}

function checkLeftDiagonal(board, symbol) {
    let count = 0;
    for(square of board) {
        if (square.symbol == symbol && square.column == 0 && square.row == 0) {
            count++;
        }
        if (square.symbol == symbol && square.column == 1 && square.row == 1) {
            count++;
        }
        if (square.symbol == symbol && square.column == 2 && square.row == 2) {
            count++;
        }
    }
    if (count == 3) return true;
    else return false;
}


function checkRightDiagonal(board, symbol) {
    let count = 0;
    for(square of board) {
        if (square.symbol == symbol && square.column == 2 && square.row == 0) {
            count++;
        }
        if (square.symbol == symbol && square.column == 1 && square.row == 1) {
            count++;
        }
        if (square.symbol == symbol && square.column == 0 && square.row == 2) {
            count++;
        }
    }

    if (count == 3) return true;
    else return false;
}

function resetGame(boardContainer) {
    boardContainer.innerHTML = ''
    return setup(boardContainer);
}