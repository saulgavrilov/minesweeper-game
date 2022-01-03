document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let width = 10;
  let bombAmount = 20;
  let flags = 0;
  let squares = [];
  let isGameOver = false;

  // Create Board
  function createBoard() {
    // Get shuffled game array with random booms
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    const gameArray = emptyArray.concat(bombsArray);
    const shuffeldArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffeldArray[i]);
      grid.appendChild(square);
      squares.push(square);

      // Normal click
      square.addEventListener("click", (e) => {
        click(square);
      });

      // cntrl & left click
      square.oncontextmenu = (e) => {
        e.preventDefault();
        addFlag(square);
      };
    }

    // Add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i === width - 1;

      if (squares[i].classList.contains("valid")) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) {
          total += 1;
        }
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        ) {
          total += 1;
        }
        if (i > 10 && squares[i - width].classList.contains("bomb")) {
          total += 1;
        }
        if (
          i > 11 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        ) {
          total += 1;
        }
        if (
          i < 98 &&
          !isRightEdge &&
          squares[i + 1].classList.contains("bomb")
        ) {
          total += 1;
        }
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        ) {
          total += 1;
        }
        if (
          i < 88 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        ) {
          total += 1;
        }
        if (i < 89 && squares[i + width].classList.contains("bomb")) {
          total += 1;
        }

        squares[i].setAttribute("data", total);
      }
    }
  }
  createBoard();

  // Add flag with right click
  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flags < bombAmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerText = "🚩";
        flags += 1;
        checkForWin();
      } else {
        square.classList.remove("flag");
        square.innerText = "";
        flags -= 1;
      }
    }
  }

  // click on square actions
  function click(square) {
    let currentID = square.id;
    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;
    if (square.classList.contains("bomb")) {
      GameOver(square);
    } else {
      let t = square.getAttribute("data");
      if (t != 0) {
        square.classList.add("checked");
        square.innerText = t;
        return;
      }
      checkSquare(square, currentID);
    }
    square.classList.add("checked");
  }

  // Check neighboring squares once square is clicked
  function checkSquare(square, currentID) {
    const isLeftEdge = currentID % width === 0;
    const isRightEdge = (currentID % width) - 1;

    setTimeout(() => {
      if (currentID > 0 && !isLeftEdge) {
        const newID = squares[parseInt(currentID) - 1].id;
        const newSquare = document.getElementById(newID);
        click(newSquare);
      }
      if (currentID > 9 && !isRightEdge) {
        const newID = squares[parseInt(currentID) + 1 - width].id;
        const newSquare = document.getElementById(newID);
        click(newSquare);
      }
      if (currentID > 10) {
        const newID = squares[parseInt(currentID) - width].id;
        const newSquare = document.getElementById(newID);
        click(newSquare);
      }
      if (currentID > 11 && !isLeftEdge) {
        const newID = squares[parseInt(currentID) - 1 - width].id;
        const newSquare = document.getElementById(newID);
        click(newSquare);
      }
      if (currentID < 98 && !isRightEdge) {
        const newID = squares[parseInt(currentID) + 1].id;
        const newSquare = document.getElementById(newID);
        click(newSquare);
      }
      if (currentID < 90 && !isLeftEdge) {
        const newID = squares[parseInt(currentID) - 1 + width].id;
        const newSquare = document.getElementById(newID);
        click(newSquare);
      }
      if (currentID < 88 && !isRightEdge) {
        const newID = squares[parseInt(currentID) + 1 + width].id;
        const newSquare = document.getElementById(newID);
        click(newSquare);
      }
      if (currentID < 89) {
        const newID = squares[parseInt(currentID) + width].id;
        const newSquare = document.getElementById(newID);
        click(newSquare);
      }
    }, 10);
  }

  // Game over
  function GameOver(square) {
    console.log("BOOOOOM Game Over");
    isGameOver = true;

    // Show all the bombs location
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerText = "💣";
      }
    });
  }

  // Check for win
  function checkForWin() {
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("bomb")
      ) {
        matches += 1;
      }
      if (matches === bombAmount) {
        console.log("WIN");
        isGameOver = true;
      }
    }
  }
});
