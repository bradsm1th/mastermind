## mastermind pseudocode

### what does `init()` need to do?
- reset the game board, and the round count
- choose a new 4-color code to break
- call `render()`


### what does `render()` need to do?
- focus/highlight row 1 column 1


### global vars
- bank of colors that make up a code [6 here]
- number of rounds to try and win

### state vars
- color code to break
- colors on the board
- current round (of 10)


--- 

## gameplay
1. page loads
2. player picks 4 **discrete** colors to form a `playerGuess`. They select by clicking through a swatch of the 6 available `COLORS`.
3. after every 4th guess, compare the complete `playerGuess` to the `correctCode`
4. if it's right, duh game over
5. if it's wrong:
  - show how close they were
    - `2` for correct color in correct spot
    - `1` for correct color in wrong spot
    - `0` for incorrect color
    - (the order of these results are arbitrary and don't/shouldn't appear in the order they do in `correctCode`)
    - update the `currentRound`
      - if it's the `MAX_ROUNDS`, end game
    - re`render()` on next row
      - so reset `playerGuess` but leave the current guess on the DOM 
6. 