# Mastermind (Browser-based game)


## Overview

This is my version of the classic puzzle game *Mastermind*. It has been around since the 1970s.

You can [read more about it on Wikipedia](https://en.wikipedia.org/wiki/Mastermind_(board_game)#) or [watch an overview on YouTube](https://www.youtube.com/watch?v=Dn0iqlY5tMU).

### Screenshots

<figure>
<figcaption><small>After calling <code>init()</code></small></figcaption>
<img src="https://i.imgur.com/bcFB6v8.png" alt="After calling `init()`" width="50%"/>
</figure>

<figure>
<figcaption>Winning</figcaption>
<img src="https://i.imgur.com/Jmitmdt.png" alt="Winning" width="50%"/>
</figure>

<figure>
<figcaption>Losing</figcaption>
<img src="https://i.imgur.com/KrxgqKA.png" alt="Losing" width="50%"/>
</figure>

<figure>
<figcaption>Original *Mastermind* game (inspiration for my design)</figcaption>
<img src="https://i.imgur.com/qSShKAq.jpg" alt="Original *Mastermind* game (inspiration for my design)" width="50%"/>
</figure>

### Technologies Used
To create this layout, I used vanilla JavaScript (no frameworks or libraries), HTML, and CSS.

## How to Load the Game
To play my version of *Mastermind*, just head to its GitHub Pages link:

> <https://bradsm1th.github.io/mastermind/>

That’s it!

### How to *Play* the Game
The rules are freely available across the internet, but here is my version of the rules:
#### Setup
- A random code is chosen. There are 6 available colors and the code is 4 'colors' long.
- Tap or click on a cell to cycle through each color until you are satisifed with your guess.
- You have 10 guesses to crack the code.
- Though *you* may use the same color multiple times in a single guess, codes are guaranteed to be **four** **discrete** colors. This means a valid code cannot have a blank space or any repeated colors.
#### Feedback during gameplay
- Each round, you earn:
- `1` point if the color is correct but the location is not. This is indicated by a `white` result circle.
- `2` points if the the color and its location are correct. This is indicated by a `red` result circle.
- `0` points if the color is not in the code. This is indicated by a `black`[^1] result circle.
- If you do not guess the code in 10 guesses, the other player earns `11` points.

#### Notes
- What makes the game challenging is  the *randomness* of the feedback/score. Results do not indicate *which* color/cell was correct or incorrect.


## Next Steps
- Keep score
- Add some animation
- Add some options present in the original, like allowing a code to have duplicate colors and/or blank spaces
- Put the rules on the page
- Clean up mobile/small layout (bigger targets, less wasted space)

[^1]: Blank in the original game, instead of black.
