const X_CLASS = "x";
const O_CLASS = "o";
const TIE_CLASS = "tie";
const PLAYABLE_CLASS = "playable";

const X_TURN_MESSAGE = "X turn";
const O_TURN_MESSAGE = "O turn";
const X_WIN_MESSAGE = "X winner!";
const O_WIN_MESSAGE = "O winner!";
const DRAW_MESSAGE = "It's a draw!";

const BIG_X_CLASS = "bigx"; 

const WIN_COMBINATIONS = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

var sectionInPlay = -1;

var xTurn = true;
var playing = true;
const sections = document.querySelectorAll("[section]");
const board = document.getElementById("board");
const title = document.getElementById("title");
const winnerMessage = document.getElementById("winner-message");
const playAgainButton = document.getElementById("play-again");

winnerMessage.innerHTML = X_TURN_MESSAGE;
//event debut
sections.forEach(section => {
    section.classList.add(PLAYABLE_CLASS);
    section.addEventListener('click', handleClick);
});

function handleClick(e) {
    if (!playing) { // verifier statut de la game
        return;
    }

    if (e.target.className !== "cell" // statut de cells
    || !e.currentTarget.classList.contains(PLAYABLE_CLASS)) { // non jouable
        return;
    }

    const section = e.currentTarget;
    const cell = e.target;

    currentClass = xTurn ? X_CLASS : O_CLASS;
    cell.classList.add(currentClass); // update the cell

    const win = isWin(currentClass, section);
    const draw = !win && isDraw(section); // short circuit

    if (win) { // win 
        section.classList.add(currentClass);
        if (xTurn) { // 
            section.children[8].classList.add(BIG_X_CLASS);
        }
    } else if (draw) {
        section.classList.add(TIE_CLASS);
    }

    if (draw || win) {
        if (isWin(currentClass, board)) {
            return gameOver(currentClass, true);
        } else if (isDraw(board)) {
            return gameOver(currentClass, false);
        }
    }

    updateSectionInPlay(cell, section);

    xTurn = !xTurn; // switch 
    winnerMessage.innerHTML = xTurn ? X_TURN_MESSAGE : O_TURN_MESSAGE;
}

function gameOver(currentClass, win) {
    playing = false;
    sections.forEach(section => { // seems ridiculous, but it's cosmetic
        section.classList.add(PLAYABLE_CLASS);
    }); 
    if (win) {
        winnerMessage.innerHTML = currentClass === X_CLASS ? X_WIN_MESSAGE : O_WIN_MESSAGE;
        showRecommencerButton();//Afficher bouton pour relancer
    } else {
        winnerMessage.innerHTML = DRAW_MESSAGE;
        showRecommencerButton();//idem
    }
}

function updateSectionInPlay(cell, section) {
    sections.forEach(section => {
        section.classList.remove(PLAYABLE_CLASS);
    });
    const squares = section.children;
    const numSquares = squares.length;
    let playedSquare;

    for (let i = 0; i < numSquares; ++i) {
        if (squares[i] === cell) {
            playedSquare = i;
            break;
        }
    }

    if (playable(sections[playedSquare])) {
        sectionInPlay = playedSquare;
        sections[playedSquare].classList.add(PLAYABLE_CLASS);
    } else {
        sections.forEach(section => {
            if (playable(section)) {
                section.classList.add(PLAYABLE_CLASS);
            }
        });
    }
}

function playable(section) {
    const classes = section.classList;
    return !(classes.contains(X_CLASS) 
          || classes.contains(O_CLASS) 
          || classes.contains(TIE_CLASS));
}

function isWin(currentClass, target) {
    const squares = target.children;
    // check combination
    return WIN_COMBINATIONS.some(combination => {
        // check  combination
        return combination.every(index => {
            return squares[index].classList.contains(currentClass);
        });
    });
}

function isDraw(target) {
    const squares = target.children;
    return [...squares].every(square => {
        const classes = square.classList;
        return classes.contains(X_CLASS) 
            || classes.contains(O_CLASS)
            || classes.contains(TIE_CLASS);
    });
}
function showRecommencerButton() {
    playAgainButton.hidden = false;
}