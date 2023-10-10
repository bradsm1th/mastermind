/* =======================
/* constants
/* =====================*/
const COLORS = {
  0: '-',               // null. not valid
  1: 'crimson',         // used as 'exact' in results
  2: 'white',           // used as 'partial' in results
  3: 'darkslategray',   // used as 'wrong' in results
  4: 'cadetblue',
  5: 'green',
  6: 'goldenrod',
}

const CODE_LENGTH = 4;

const MAX_ROUNDS = 10;

/* =======================
/* state variables
/* =====================*/
let board;          // [[]]. 10 rows of 4 
let codeToBreak;    // [x,x,x,x]. 4 randoms from COLORS
let currentRound;   // #. of 10 rows/guesses

let currentGuess;   // [x,x,x,x]. 4 numbers that equate to COLORS[x]
let roundResults;   // []. 'wrong', 'exact', 'partial'


// current cell
// 🧐🧐🧐🧐🧐🧐🧐🧐 may not need this
let currentCell;   // #. To update color clicks



/* =======================
/* cached elements 
/* =====================*/

// result message (Game over, You win, etc.)
const resultMsgEl = document.querySelector('#results');
// the answer cells; ∑ should be 4
const theAnswerEls = document.querySelectorAll('#theAnswer .answerCell');
// all board cells (guess and result); ∑ should be 80
const allCellEls = document.querySelectorAll('#gameBoard .cell');
// all rows; ∑ should be 20
const allRowEls = document.querySelectorAll('#gameBoard .row');
// grab just the active *guess* row ; ∑ should be 4
const activeRowEls = document.querySelectorAll('#guessCells .row.active .cell');
// button to check active row's guess
const checkGuessEl = document.querySelector('#checkGuess');
// grab just the active *results* row; ∑ should be 4
const activeResultEls = document.querySelectorAll('#resultCells .row.active .cell');
// current round
const currentRoundEl = document.querySelector('#message');
// the reset button
const resetEl = document.querySelector('#reset')


/* =======================
/* event listeners
/* =====================*/
// add 4 listeners: 1 for each cell in active row
activeRowEls.forEach(cell => cell.addEventListener('click', handleNewColor));

// check guess against answer
checkGuessEl.addEventListener('click', handleGuessCheck);

// reset game
resetEl.addEventListener('click', init);

// 

/* =======================
/* functions
/* =====================*/
init();

// check current guess (2 arrays: the guess and the answer)
function handleGuessCheck() {
  activeRowEls.forEach((cell, idx) => {
    currentGuess[idx] = cell.innerText;
  });
  return checkGuess(currentGuess);
}

// actually check current guess against codeToBreak
function checkGuess() {
  // GUARD
  // only check once currentGuess is valid
  if (currentGuess.includes(0)) {
    return renderResults("That's not a valid guess");
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
  }
  renderRound()

  // handle winner (.exact = 4);
  if (roundResults.every(val => val === 'exact')) {
    console.log("YOU WON!");
    renderAnswer();
  };

  console.log(roundResults);
  return renderResults(roundResults);
}

// change a single cell to the next color in COLORS
function handleNewColor(evt) {
  // GUARDS
  // ignore if the actual cell wasn't clicked
  if (!evt.target.classList.contains('cell')) { return };

  // increment clicks unless at end (then start over)
  if (evt.target.innerText < Object.keys(COLORS).length - 1) {
    evt.target.innerText++;
  } else {
    evt.target.innerText = 0;
  }
  updateColor(evt.target.innerText)
}

// change return value to next value in COLORS
function updateColor(colorKey) {
  console.log(`color needs to change to: ${COLORS[colorKey]}…`)
}

function init() {
  // (re)set all state
  currentRound = 1;
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
  console.log(`Code (number): ${codeToBreak}`)

  // re-enable checkGuess button and add event listener back to it
  checkGuessEl.removeAttribute('disabled');
  checkGuessEl.addEventListener('click', handleGuessCheck);

  // reset "reset button" text
  resetEl.innerText = "Reset";

  render();
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
    cell.innerText = `${COLORS[0]}`;
  });
  theAnswerEls.forEach(cell => {
    cell.innerText = `?`;
    cell.style.backgroundColor = `initial`;
    cell.style.borderColor = `${COLORS[6]}`;
  });
  resultMsgEl.innerText = "Let's play!"

  // reset 'active' class on guess row and result row

  return board;
}

// change round 
function renderRound() {
  // GUARD. 
  // last round
  if (currentRound > MAX_ROUNDS) {
    currentRoundEl.innerHTML = "Sorry, You Lose";
    // update reset button text to "Play again"
    resetEl.innerText = "Play again?";
    
    
    // enable/disable "check guess" button
    toggleCheckButton()
  
  
  } else {
    currentRoundEl.innerHTML = `Round <mark>${currentRound++}</mark> of 10`;
  }
}

// render answer
function renderAnswer() {
  // theAnswerEls.visibility = 
  theAnswerEls.forEach((cell, idx) => {
    // cell.style.backgroundColor = `${codeToBreak[idx]}`;
    cell.style.backgroundColor = `${COLORS[codeToBreak[idx]]}`;
    cell.style.borderColor = (`${COLORS[codeToBreak[idx]]} === 'white'`) ? 'black' : `${COLORS[codeToBreak[idx]]}`;
    cell.innerText = '';
  })
}

// render results
function renderResults(message) {
  // update the message
  resultMsgEl.innerText = message;

  // update the results row

  // activeResultEls.forEach((div, idx) => {
  //   // this is just test code
  //   div.innerText = `3`
  //   console.log(div.innerText);
  //   // …that was test code
  // });
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

// update active row to next one


// update guessResults