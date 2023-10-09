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
let currentGuess;   // #. of 6 colors
let board;          // [[]]. 10 rows of 4 


/* =======================
/* cached elements 
/* =====================*/
const theAnswerEls = document.querySelectorAll('#theAnswer .answerCell');


/* =======================
/* event listeners
/* =====================*/

// (for guess listener: only listen if that row / those cells has/have 'active' class )
// …then remove the listener maybe?


/* =======================
/* functions
/* =====================*/
init();

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
  currentGuess = '';
  
  console.log(`It's round ${currentRound}`)
  console.log(`Code (number): ${codeToBreak}`)
  
  render();
}

function render() {
  renderRound(currentRound);
  renderBoard();

}

function renderBoard() {

}

// change
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