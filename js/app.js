const docTitle = document.querySelector('body h1');

console.log(`My ${docTitle.innerText.toLowerCase()}/app.js is being run…`);


/* =======================
/* constants
/* =====================*/
const COLORS = [
  'red',
  'white',
  'black',
  'blue',
  'green',
  'yellow',
]

const MAX_ROUNDS = 10;

/* =======================
/* state variables
/* =====================*/
let codeToBreak;    // 4 randoms from COLORS
let currentRound;   // #. of 10
let currentGuess;   // #. of 6
let board;          // [[]]. 10 rows of 4 


/* =======================
/* cached elements 
/* =====================*/


/* =======================
/* event listeners
/* =====================*/
// the current round
const currentRoundEl = document.querySelector('#whatRound span');


/* =======================
/* functions
/* =====================*/
init();

function init() {
  console.log('…initialized')
  currentRound = 10;
  console.log(`It's round ${currentRound}`)

currentGuess = '';

// codeToBreak = 

board =  [
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
]

render();
}

function render() {
  console.log('\t…rendered');

  renderRound(currentRound);

  renderBoard()
}

function renderBoard() {

}

function renderRound(round) {
  currentRoundEl.innerHTML = `<strong>${round}</strong>`;
}


// check if game is over
if (currentRound++ === MAX_ROUNDS) { console.log("Game Over—sorry you didn't win!")};