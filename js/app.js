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
    currentGuess[idx] = cell.style.backgroundColor;
    if (currentGuess.includes('initial')) {
      renderResultMessage("FYI, your guess isn't complete yet…");
      return;
    }
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

  // dumping ground (to avoid duplicates)
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

  // update results row
  renderResultsRow(roundResults);

  // update round (message);
  renderRound()

  // update active rows
  setNextActiveRows();
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
  // GUARDs. 

  switch (currentRound) {
    case 0:
      currentRoundEl.innerHTML = (`Round ${currentRound + 1} of ${MAX_ROUNDS}`);
      currentRound += 1;
      break;
    case 1:
      currentRound++;
      currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
      break;
    case 2:
      currentRound++;
      currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
      break;
    case 3:
      currentRound++;
      currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
      break;
    case 4:
      currentRound++;
      currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
      break;
    case 5:
      currentRound++;
      currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
      break;
    case 6:
      currentRound++;
      currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
      break;
    case 7:
      currentRound++;
      currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
      break;
    case 8:
      currentRound++;
      currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
      break;
    case 9:
      currentRound++;
      currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
      renderResultMessage("Last chance!");
      break;
    case 10:
      currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
    default:
      console.log(`${currentRound}: It's anything besides 0`);
      renderAnswer("Sorry, You Lose");
      // toggle "check guess" button
      toggleCheckButton();
  }

  // ❗old
  // if it's the first round, don't update til next call
  // if (currentRound === 0) {
  // }

  // if (currentRound + 1 === MAX_ROUNDS) {
  //   currentRoundEl.innerHTML = (`Round ${currentRound++} of ${MAX_ROUNDS}`);
  //   // currentRound += 1;
  // }

  // // if you lose on the last round, it's GAME OVER:
  // if (currentRound === MAX_ROUNDS) {
  //   renderAnswer("Sorry, You Lose");
  //   // toggle "check guess" button
  //   toggleCheckButton();
  //   return;
  //   // just update current round 
  // } else {
  //   currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
  //   renderResultMessage("Not quite — try again!");
  //   // currentRound += 1;
  // }
  // ❗old
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
  const activeIndices = []
  // get class list of active rows
  allRowEls.forEach((row, idx) => {
    if (row.classList.contains('active')) {
      // console.log(`Row at index ${idx} should be active`);
      activeIndices.push(idx);
    }

  });

// update which rows are now active and which no longer are
  activeIndices.forEach(row => {
    console.log(row);
    // add '.active' class to next row
    allRowEls[row + 1].classList.add('active');
    // remove '.active' class from them
    allRowEls[row].classList.remove('active');
  })
  
  console.log(activeRowEls);

  // add listener to next row

  // remove listeners from them

}