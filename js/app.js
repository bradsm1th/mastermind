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
const allRowEl = document.querySelectorAll('#gameBoard .row');

// guess rows;
const guessRowEl = document.querySelector('#gameBoard #guessRows');

// cells in active *guess* row ; ∑ should be 4 cells
let activeGuessEls = document.querySelectorAll('#guessRows .row.active .cell');

// cells in active *results* row; ∑ should be 4 cells
let activeResultEls = document.querySelectorAll('#resultRows .row.active .cell');

// both .active rows (∑2: one active #guessCells row, one active #resultRows row)
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
// check guess button
checkGuessEl.addEventListener('click', handleGuessCheck);

// reset game
resetEl.addEventListener('click', init);

// listen for click on any active guess cell
guessRowEl.addEventListener('click', handleNewColor);

/* =======================
/* functions
/* =====================*/
init();

function init() {
  // remove old listeners
  guessRowEl.removeEventListener('click', handleNewColor);
  checkGuessEl.removeEventListener('click', handleGuessCheck);

  // (re)set all state
  currentRound = 0;
  board = [
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
  enableCheckButton();

  // reset "reset button" text
  resetEl.innerText = "Reset";

  // add listeners back
  guessRowEl.addEventListener('click', handleNewColor);
  checkGuessEl.addEventListener('click', handleGuessCheck);

  // (re)render the board and the round
  render();
}

// check current guess (2 arrays: the guess and the answer)
function handleGuessCheck() {

  // activeGuessEls.forEach((cell, idx) => {
  //   currentGuess[idx] = cell.style.backgroundColor;
  // });

  console.log(allRowEl[currentRound]);

  [...allRowEl[currentRound].children].forEach((cell, idx) => {
    currentGuess[idx] = cell.style.backgroundColor;
  });

  const resultGuess = [...currentGuess];
  // add current guess to board
  board[currentRound - 1] = resultGuess;

  checkGuess();
}

// actually check current guess against codeToBreak
function checkGuess() {
  // test for incomplete guess
  console.log(`${currentGuess} for dinner`);

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

  if (currentGuess.includes('initial')) {
    renderResultMessage("FYI, that's not a complete guess…");
    return;
  }

  // test for winner
  if (roundResults.every(val => val === 'exact')) {
    renderAnswer("!!~~ YOU WIN ~~!!");
    disableCheckButton();
    return;
  }

  // These are called only if the guess is valid but wrong
  // update round
  currentRound++;
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

  // currentGuess = [0,0,0,0];
  // currentGuess[idx] = evt.target.style.backgroundColor;
  console.log("!!!!!!!!!!!");

  // GUARDS
  // Ignore click if row is inactive or if an actual cell wasn't clicked
  if (!evt.target.parentElement.classList.contains('active') || (!evt.target.classList.contains('cell'))) { return; }

  // REMOVE ME
  console.log(evt.target);
  console.log(evt.target.parentElement.classList.contains('active'));

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

// if button is currently disabled, re-enable it
function enableCheckButton() {
  checkGuessEl.removeAttribute('disabled');
  checkGuessEl.addEventListener('click', handleGuessCheck);
  checkGuessEl.style.setProperty('border-color', 'initial');
  checkGuessEl.style.setProperty('boxShadow', 'initial');
}

// if it's enabled, disable it
function disableCheckButton() {
  checkGuessEl.setAttribute('disabled', 'disabled');
  checkGuessEl.removeEventListener('click', handleGuessCheck);
  checkGuessEl.style.setProperty('border-color', 'gray');
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
  allRowEl.forEach(row => row.classList.remove('active'));
  allRowEl[0].classList.add('active');
  allRowEl[10].classList.add('active');

  // return board;
}

// change round text
function renderRound() {
  console.log(currentRound);
  currentRoundEl.innerHTML = (`Round ${currentRound + 1} of ${MAX_ROUNDS}`);

  const resultMessage = (currentRound === 9) ? "Last chance!" : "Not quite – guess again!";
  renderResultMessage(resultMessage);

  if (currentRound === MAX_ROUNDS) {
    currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
    renderAnswer("Sorry, You Lose");
    // toggle "check guess" button
    disableCheckButton();
  }


  // // ❗OLD
  // if (currentRound === 0) {
  //   currentRoundEl.innerHTML = (`Round ${currentRound + 1} of ${MAX_ROUNDS}`);
  // } else if (currentRound > 0 && currentRound < 9) {
  //   currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
  // } else if (currentRound === MAX_ROUNDS) {
  //   currentRoundEl.innerHTML = (`Round ${currentRound} of ${MAX_ROUNDS}`);
  //   renderAnswer("Sorry, You Lose");
  //   // toggle "check guess" button
  //   disableCheckButton();
  // }
  // ❗OLD
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
  // get active guess row (active result row is just +10 in allRowEl)

  let previousGuessIndex = currentRound - 1;

  // testing
  allRowEl[previousGuessIndex].classList.remove('active');
  allRowEl[currentRound].classList.add('active');
  // allRowEl[previousGuessIndex+10].classList.remove('active');
  // allRowEl[currentRound+10].classList.add('active');

  // // add '.active' to next two rows
  // console.log(allRowEl[activeGuessIndex + 1]);
  // console.log(allRowEl[activeGuessIndex + 10]);
  // allRowEl[previousGuessIndex + 1].classList.add('active');
  // allRowEl[previousGuessIndex + 10].classList.add('active');

  // // remove '.active' from two rows
  // console.log(allRowEl[activeGuessIndex]);
  // console.log(allRowEl[activeGuessIndex]);
  // allRowEl[previousGuessIndex].classList.remove('active');
  // allRowEl[previousGuessIndex + 9].classList.remove('active');

  // see what needs to happen w/ listeners


}