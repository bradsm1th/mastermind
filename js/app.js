/* =======================
/* constants
/* =====================*/
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
  currentRound = 0;
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

  // re-enable checkGuess button
  checkGuessEl.removeAttribute('disabled');

  // reset "reset button" text
  resetEl.innerText = "Reset";

  // reset rows
  activeGuessEls.forEach(cell => {
    cell.addEventListener('click', handleNewColor)
  });


  render();
}

// check current guess (2 arrays: the guess and the answer)
function handleGuessCheck() {

  activeGuessEls.forEach((cell, idx) => {
    currentGuess[idx] = cell.style.backgroundColor;
  });

  const resultGuess = [...currentGuess];
  // add current guess to board
  board[currentRound - 1] = resultGuess;

  return checkGuess(resultGuess);
}

// actually check current guess against codeToBreak
function checkGuess() {
  // clear roundResults to check this guess
  roundResults = [];

  // process guess to *not* count duplicates more than once)
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
      // if it's there but not in that index (and not already in valuesChecked)
    } else if (codeToBreak.includes(cell.toString()) && !valuesChecked.includes(cell)) {
      roundResults.push('partial');
      valuesChecked.push(cell);
    }

  })

  // ==========================
  //           GUARDS
  // ==========================
  // test for incomplete guess
  if (currentGuess.includes('initial')) {
    renderResultMessage("FYI, that's not a complete guess…");
    return;
  }

  // test for winner
  if (roundResults.every(val => val === 'exact')) {
    renderAnswer("!!~~ YOU WIN ~~!!");
    toggleCheckButton();
    return;
  }

  // update results text
  renderResultMessage("Not quite –— guess again!")

  // update round text;
  renderRound()

  // update results row
  renderResultsRow(roundResults);

  // update active rows
  setNextActiveRows();

  return;
}

// click through each available color for each cell
function handleNewColor(evt) {

  // GUARDS
  // ignore if the actual cell wasn't clicked
  if (!evt.target.classList.contains('cell')) { return };


  // cycle through clicks/colors, looping at end
  if (evt.target.innerText === '-' || evt.target.innerText === '5') {
    evt.target.innerText = '0';
    evt.target.style.backgroundColor = `${COLORS[0]}`
    evt.target.style.color = `${COLORS[0]}`
  } else {
    evt.target.innerText++;
    evt.target.style.backgroundColor = `${COLORS[evt.target.innerText]}`
    evt.target.style.color = `${COLORS[evt.target.innerText]}`
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
    checkGuessEl.style.setProperty('border-color', 'gray');
    checkGuessEl.style.setProperty('box-shadow', 'none');
  }
}

function render() {
  renderBoard();
  renderRound();
  renderResultMessage(message = "Let's play!");
}

function renderBoard() {
  // reset ALL guess rows
  allCellEls.forEach(cell => {
    cell.innerText = `-`;
    cell.value = `0`;
    cell.style.backgroundColor = 'initial';
    cell.style.color = 'initial';
  });

  theAnswerEls.forEach(cell => {
    cell.innerText = `?`;
    cell.style.backgroundColor = `initial`;
    cell.style.borderColor = `goldenrod`;
  });

  // reset 'active' class on first guess row and first result row
  allRowEls.forEach(row => row.classList.remove('active'));
  allRowEls[0].classList.add('active');
  allRowEls[10].classList.add('active');

  // return board;
}

// change round text
function renderRound() {

  if (currentRound === 0) {
    currentRoundEl.innerHTML = (`Round ${currentRound + 1} of ${MAX_ROUNDS}`);
    currentRound++;
  } else if (currentRound > 0 && currentRound < 9) {
    currentRound++;
    currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
  } else if (currentRound === 9) {
    currentRound++;
    currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
    renderResultMessage("Last chance!");
  } else if (currentRound === MAX_ROUNDS) {
    currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
    renderAnswer("Sorry, You Lose");
    // toggle "check guess" button
    toggleCheckButton();
  }
}

// render answer  
function renderAnswer(message) {

  // show a message instead of "round x of 10"
  currentRoundEl.innerText = message;
  resultMsgEl.innerText = "Want to try again?";

  // change "reset button" text
  resetEl.innerText = "Play again";

  theAnswerEls.forEach((cell, idx) => {
    cell.style.backgroundColor = `${codeToBreak[idx]}`;
    cell.style.borderColor = `${codeToBreak[idx]}`;
    cell.innerText = '';
  })
}

// render results row
function renderResultsRow(arr) {
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
}

// render results message
function renderResultMessage(message) {
  // update the message
  resultMsgEl.innerText = message;
}

// generate a new 4-digit code
function makeNewCode() {
  // make a copy of keys in COLORS
  let masterCopy = [...COLORS];
  masterCopy.forEach(color => {

  });

  // get random number bt 0-5 (the length of the COLORS array)
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

// update next active rows to accept guesses
function setNextActiveRows() {
  // ============================
  // ==========checks============
  // ============================

  // grab indexes of both active rows
  const activeRows = {
    'guess': -1,
    'result': -1,
  }
  // // get class list of active rows
  // // allRowEls.forEach((row, idx) => {
  // //   // guess row only
  // //   if (row.classList.contains('active') && idx < 10) {
  // //     console.log(`${idx}: ${row}`);

  // //     // result row only
  // //   } else {
  // //     // activeRows['result'] = idx;
  // //     console.log(row, idx);
  // //   }

  // //   console.log(activeRows);

  // // });

  // // update which rows are now active and which no longer are
  // for (let row in activeRows) {
  //   console.log(row);
  //   // add '.active' class to next row
  //   allRowEls[activeRows][row + 1].classList.add('active');
  //   // add listener to next row
  //   allRowEls[activeRows][row + 1].addEventListener('click', handleNewColor);

  //   // disable user-select
  //   allRowEls[activeRows][row].style.cursor = "not-allowed";

  //   // remove '.active' class from them
  //   allRowEls[activeRows][row].classList.remove('active');
  //   // remove listeners from them
  //   allRowEls[activeRows][row].removeEventListener('click', handleNewColor);
  // };


  // activeGuessEls.forEach(cell => {
  //   cell.addEventListener('click', handleNewColor)
  // });

  console.log(activeRowEls);


}