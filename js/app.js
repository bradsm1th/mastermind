/* =======================
/* constants
/* =====================*/
// const COLORS = {
//   0: '-',               // null. not valid
//   1: 'crimson',         // used as 'exact' in results
//   2: 'white',           // used as 'partial' in results
//   3: 'black',          // used as 'wrong' in results
//   4: 'blue',
//   5: 'green',
//   6: 'goldenrod',
// }

const COLORS = [
  'white',      // 0. used as 'partial' in results 
  'crimson',    // 1. used as 'exact' in results
  'black',      // 2. used as 'wrong' in results
  'blue', 
  'green', 
  'goldenrod'
]

const CODE_LENGTH = 4;
const MAX_ROUNDS = 10;

/* =======================
/* state variables
/* =====================*/
let board;          // [[]]. 10 rows of 4 
let codeToBreak;    // [x,x,x,x]. 4 randoms from COLORS
let currentRound;   // #. of 10 rows/guesses
let roundResults;   // []. 'wrong', 'exact', 'partial'
let currentGuess;   // [x,x,x,x]. 4 numbers that equate to COLORS[x]
let currentCell;


/* =====================================================================
/* cached elements 
/* ===================================================================*/


/* =======================
/* the entire board
/* =====================*/
// result message (Game over, You win, etc.)
const resultMsgEl = document.querySelector('#results');

// all board cells (guess and result); ∑ should be 80
const allCellEls = document.querySelectorAll('#gameBoard .cell');

// current round
const currentRoundEl = document.querySelector('#message');

/* =======================
/* rows
/* =====================*/
// all rows; ∑ should be 20
const allRowEls = document.querySelectorAll('#gameBoard .row');

// cells in active *guess* row ; ∑ should be 4 cells
const activeGuessEls = document.querySelectorAll('#guessCells .row.active .cell');

// cells in active *results* row; ∑ should be 4 cells
const activeResultEls = document.querySelectorAll('#resultCells .row.active .cell');

// both .active rows (∑2: one active #guessCells row, one active #resultCells row)
const activeRowEls = document.querySelectorAll('.row.active');

/* =======================
/* cells
/* =====================*/
// answer cells; ∑ should be 4
const theAnswerEls = document.querySelectorAll('#theAnswer .answerCell');

/* =======================
/* buttons
/* =====================*/
// button to check active row's guess
const checkGuessEl = document.querySelector('#checkGuess');

// the reset button
const resetEl = document.querySelector('#reset')


/* =======================
/* event listeners
/* =====================*/
// check guess against answer
checkGuessEl.addEventListener('click', handleGuessCheck);

// reset game
resetEl.addEventListener('click', init);


/* =======================
/* functions
/* =====================*/
init();

function init() {
  // (re)set all state
  currentRound = -1;
  board = [
    // 0/falsy is empty. 1–6/truthy are a color
    [0, 0, 0, 0],  // guess 1
    [0, 0, 0, 0],  // guess 2
    [0, 0, 0, 0],  // guess 3
    [0, 0, 0, 0],  // guess 4
    [0, 0, 0, 0],  // guess 5
    [0, 0, 0, 0],  // guess 6
    [0, 0, 0, 0],  // guess 7
    [0, 0, 0, 0],  // guess 8
    [0, 0, 0, 0],  // guess 9
    [0, 0, 0, 0],  // guess 10
  ]
  currentCell = COLORS[0];
  codeToBreak = makeNewCode();
  currentGuess = [0, 0, 0, 0];
  roundResults = [];
  console.log(`It's round ${currentRound}`)
  console.log(`Answer: ${codeToBreak}`)

  // re-enable checkGuess button
  checkGuessEl.removeAttribute('disabled');

  // reset "reset button" text
  resetEl.innerText = "Reset";

  // reset rows
  // where TF do i put this function? where do i need the listeners *created*?
  activeGuessEls.forEach((cell, idx) => {
    // console.log(`hello from cell @ index ${idx}`);
    cell.addEventListener('click', handleNewColor)
  });


  render();
}

// check current guess (2 arrays: the guess and the answer)
function handleGuessCheck() {
  activeGuessEls.forEach((cell, idx) => {
    currentGuess[idx] = cell.innerText;
  });

  return checkGuess(currentGuess);
}

// actually check current guess against codeToBreak
function checkGuess() {

  // add current guess to board
  console.log(`currentRound: ${currentRound}`)
  board[currentRound] = currentGuess;


  // clear roundResults
  roundResults = [];

  // GUARD
  // only check once currentGuess is valid
  if (currentGuess.includes('-')) {
    renderResultMessage("That's not a valid guess");
    return;
  } else {
    let valuesChecked = [];
    currentGuess.forEach((cell, idx) => {
      // if current cell is wrong
      if (!codeToBreak.includes(cell.toString())) {
        // console.log(cell);
        roundResults.push('wrong');
        // …if it's exactly right
      } else if (cell.toString() === codeToBreak[idx]) {
        // console.log(`EXACTAMUNDO! ${cell}`);
        roundResults.push('exact');
        // if it's there but not in that index
      } else if (codeToBreak.includes(cell.toString()) && !valuesChecked.includes(cell)) {
        roundResults.push('partial');
        valuesChecked.push(cell);
      }
    })
    console.log(roundResults);
  }

  // handle winner (.exact = 4);
  if (roundResults.every(val => val === 'exact')) {
    renderAnswer("YOU WON!");
  };

  // update results row
  renderResultsRow(roundResults);

  // update round (message);
  renderRound()

  // update active rows
  // updateActiveRows();

  return;
}

// click through each available color for each cell
function handleNewColor(evt) {
  console.log(`${evt.target.innerText} (before loop)`);

  // GUARDS
  // ignore if the actual cell wasn't clicked
  if (!evt.target.classList.contains('cell')) { return };

  // cycle through clicks/colors, looping at end
  if (evt.target.innerText === '-') {
    evt.target.innerText = '1';
    // evt.target.style.backgroundColor = `${COLORS[1]}`
    // evt.target.style.color = `${COLORS[1]}`
  } else if (evt.target.innerText === '6') {
    evt.target.innerText = '1';
    // evt.target.style.backgroundColor = `${COLORS[6]}`
    // evt.target.style.color = `${COLORS[6]}`
  } else {
    evt.target.innerText++;
    // evt.target.style.backgroundColor = `${COLORS[evt.target.innerText]}`
    // evt.target.style.color = `${COLORS[evt.target.innerText]}`
  }
}

function toggleCheckButton() {
  // if button is currently disabled, re-enable it
  if (checkGuessEl.getAttributeNames().includes('disabled')) {
    checkGuessEl.removeAttribute('disabled');
    checkGuessEl.addEventListener('click', handleGuessCheck);
  };
  // if it's enabled, disable it
  if (!checkGuessEl.getAttributeNames().includes('disabled')) {
    checkGuessEl.setAttribute('disabled', 'disabled');
    checkGuessEl.removeEventListener('click', handleGuessCheck);
  }
}

function render() {
  renderRound(currentRound);
  renderBoard();
}

function renderBoard() {
  // reset ALL guess rows
  allCellEls.forEach(cell => {
    cell.innerText = `-`;
    cell.style.backgroundColor = 'initial';
    cell.style.color = 'initial';
  });

  theAnswerEls.forEach(cell => {
    cell.innerText = `?`;
    cell.style.backgroundColor = `initial`;
    cell.style.borderColor = `${COLORS[5]}`;
  });

  resultMsgEl.innerText = "Let's play!"

  // reset 'active' class on guess row and result row
  allRowEls.forEach(row => row.classList.remove('active'));
  allRowEls[0].classList.add('active');
  allRowEls[10].classList.add('active');

  // return board;
}

// change round 
function renderRound() {
  // GUARD. 
  // if it's the first round, don't update til next call
  if (currentRound === 0) {
    currentRoundEl.innerHTML = (`Round ${++currentRound} (actual: ${currentRound}) of ${MAX_ROUNDS}`);
    // if you lose on the last round, it's GAME OVER:
  } else if (currentRound === MAX_ROUNDS) {
    renderAnswer("Sorry, You Lose");
    // toggle "check guess" button
    toggleCheckButton();
    return;
    // just update current round 
  } else {
    currentRoundEl.innerHTML = (`Round ${currentRound + 1} (actual: ${currentRound}) of ${MAX_ROUNDS}`);
    renderResultMessage("Not quite—try again!");
    currentRound += 1;
  }
}

// render answer  
function renderAnswer(message) {
  // show a message instead of "round x of 10"
  console.log(message);
  currentRoundEl.innerText = message;
  resultMsgEl.innerText = "Want to try again?";

  // change "reset button" text
  resetEl.innerText = "Play again";

  theAnswerEls.forEach((cell, idx) => {
    // cell.style.backgroundColor = `${codeToBreak[idx]}`;
    cell.style.backgroundColor = `${COLORS[codeToBreak[idx]]}`;
    cell.style.borderColor = `${COLORS[codeToBreak[idx]]}`;
    cell.innerText = '';
  })
}

// render results row
function renderResultsRow(arr) {
  console.log(arr)
  arr.forEach((word, idx) => {
    switch (word) {
      case "exact":
        // console.log(`${COLORS[1]} <- color; idx -> ${idx}`);
        activeResultEls[idx].style.backgroundColor = `${COLORS[1]}`;
        activeResultEls[idx].innerText = '';
        break;
      case "partial":
        // console.log(`${COLORS[2]} <- color; idx -> ${idx}`);
        activeResultEls[idx].style.backgroundColor = `${COLORS[0]}`;
        activeResultEls[idx].innerText = '';
        break;
      case "wrong":
        // console.log(`${COLORS[3]} <- color; idx -> ${idx}`);
        activeResultEls[idx].style.backgroundColor = `${COLORS[2]}`;
        activeResultEls[idx].innerText = '';
    }
  })

  // activeResultEls.forEach((div, idx) => {
  // });
}

// render results message
function renderResultMessage(message) {
  // update the message
  resultMsgEl.innerText = message;
}

// generate a new 4-digit code
function makeNewCode() {
  // make a copy of keys in COLORS
  let masterCopy = [];
  for (let key in Object.keys(COLORS)) {
    // skip first one (it's the empty value '-')
    if (key === '0') {
      continue;
    } else {
      masterCopy.push(key);
    }
  }

  // get random number bt 1-6 (the length of the COLORS array except for 0, the one falsy value)
  function getRandIdx() {
    return Math.floor(Math.random() * masterCopy.length);
  }

  // make a dest. array
  const resultArray = [0, 0, 0, 0];
  // for each slot, 
  for (let i = 0; i < CODE_LENGTH; i++) {
    // get a new random index,
    let randomIdx = getRandIdx();
    // add @ that index to result AND
    // update masterCopy w/ spliced version
    // (splicing an arr *removes* it from arr, so that automatically prevents duplicates)
    resultArray[i] = masterCopy.splice(randomIdx, 1);
  };

  codeToBreak = resultArray.flat();

  return codeToBreak;

}


// update guessResults