/* =======================
/* constants
/* =====================*/
const COLORS = {
  0: '-',     // null
  1: 'crimson',
  2: 'white',
  3: 'darkslategray',
  4: 'cadetblue',
  5: 'green',
  6: 'goldenrod',
}

const CODE_LENGTH = 4;

const MAX_ROUNDS = 10;

/* =======================
/* state variables
/* =====================*/
let codeToBreak;    // 4 randoms from COLORS
let currentRound;   // #. of 10 rows/guesses
let currentRow;     // ''. of 4 numbers that equate to COLORS[x]
let currentCells;   // #. To update color clicks
let board;          // [[]]. 10 rows of 4 

// current cell



/* =======================
/* cached elements 
/* =====================*/
const theAnswerEls = document.querySelectorAll('#theAnswer .answerCell');
// grab just the *active* row (no need to grab entire board and then ignore all but 4 cells)
const activeRowEl = document.querySelectorAll('#guessCells .row.active');


/* =======================
/* event listeners
/* =====================*/
// add 4 listeners: 1 for each cell in active row
activeRowEl.forEach(cell => cell.addEventListener('click', handleNewColor));

/* =======================
/* functions
/* =====================*/
init();

// change a single cell to the next color in COLORS

function handleNewColor(evt) {
  // GUARDS
  // ignore if the actual cell wasn't clicked
  if (!evt.target.classList.contains('cell')) { return };

  // increment clicks unless at end (then start over)
  if (evt.target.innerText < Object.keys(COLORS).length -1) {
    evt.target.innerText++;
  } else {
    evt.target.innerText = 0;
  }
  updateColor(evt.target.innerText)
}

// change return value to next value in COLORS
function updateColor(colorKey) {
  console.log(`should be a color ${COLORS[colorKey]}…`)
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
  codeToBreak = makeNewCode();
  currentGuess = 0;

  currentCell = COLORS[0];

  console.log(`It's round ${currentRound}`)
  console.log(`Code (number): ${codeToBreak}`)

  render();
}

function render() {
  renderRound(currentRound);
  renderBoard();

}

function renderBoard() {
  // reset ALL guess rows
  board.forEach(row => {
    row.forEach((cell, idx) => {
      activeRowEl[idx] = `${COLORS[0]}`
    })
  })

  // update FIRST guess row

  // update ALL results rows
  return board;
}

// change round 
function renderRound(round) {
  // currentRoundEl.innerHTML = `<strong>${round}</strong>`;
}

// render answer
function renderAnswer() {
  theAnswerEls.forEach((cell, idx) => {
    // cell.style.backgroundColor = `${codeToBreak[idx]}`;
    cell.style.backgroundColor = `${COLORS[codeToBreak[idx]]}`;
    cell.style.borderColor = (`${COLORS[codeToBreak[idx]]} === 'white'`) ? 'black' : `${COLORS[codeToBreak[idx]]}`;
    // cell.style.color  = `${COLORS[codeToBreak[idx]]}`;
  })
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