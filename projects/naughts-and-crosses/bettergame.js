
document.addEventListener('DOMContentLoaded', start)

//variable to count the number of turns so that the game resets after the ninth turn
var moveCount = 0;
//variable which can be changed to somewhat change the difficult of the AI
var ability = 10;
//tracks the numer of player wins, AI wins, and draws
var totals = [0,0,0];
//whether the game has stopped
var inProgress = true;

function start () {
  //function adds event listeners for when each dot is clicked on
  bindEventListeners(document.getElementsByClassName('board')[0].children)
}

function bindEventListeners (dots) {
  //adds an event listener to each dot for when it is clicked on
  for (var i = 0; i < dots.length; i++) {
    dots[i].addEventListener('click', makeBlue);
  }
}

function makeBlue(evt) {
  //when a dot is clicked on, checks whether it is empty
  if (evt.target.classList.contains("green") === false && evt.target.classList.contains("blue") === false) {
    //if it is, changes it to the player colour
    evt.target.classList.add('blue');
    //checks whether placing that piece ends the game
    if (checkEndGame()) {
        //if so, the board is reset
        clearBoard();
     }
     //then the opponent has their turn
     opponentMove();
     //checks whether they end the game
     if (checkEndGame()) {
       //if so, the board is reset
       clearBoard();
    }
  }
}

function checkLine(line) {
  //these variables tell the upcoming code how to nagivate through the line
  var xinc, yinc, xpos, ypos,  dot;
  //these are the variables that will be returned by the function
  var bluecount = 0;
  var greencount = 0;
  var blank;

  //depending on the line parameter
  //lines one to three are the vertical columns
  if (line < 4) {
    xpos = line - 1;
    ypos = 0;
    xinc = 0;
    yinc = 1;
  }
  //lines four to six are the horizontal lines
  else if (line < 7) {
    xpos = 0;
    ypos = line - 4;
    xinc = 1;
    yinc = 0;
  }
  //line seven is the line from top left to bottom right
  else if (line === 8) {
    xpos = 0;
    ypos = 0;
    xinc = 1;
    yinc = 1;
  }
  //line eight is the line from bottom left to top right
  else {
    xpos = 2;
    ypos = 0;
    xinc = -1;
    yinc = 1;
  }

  //for each dot in that line
  for (var i = 0; i < 3; i++) {
    dot = document.getElementsByClassName((xpos + (xinc  * i)).toString() + (ypos + (yinc * i)).toString())[0];
    //adds one to the blue total if it is blue
    if (dot.classList.contains("blue")) {
      bluecount ++;
    }
    //adds one to the green total if it is green
    if (dot.classList.contains("green")) {
      greencount ++;
    }
    //remembers it if it is blank
    if (dot.classList.contains("green") === false && dot.classList.contains("blue") === false) {
      blank = dot;
    }
  }
  return [bluecount, greencount, blank];
}

function opponentMove() {
  //finds the best move for the opponent
  var move = findMove();
  //adds that move onto the board
  move.classList.add("green");
}

function findMove() {
  var blueBlocker, lineResult;
  //for every eight line
  for (var i = 1; i <= 8; i++) {
    //this function returns an array containing the numer of player pieces and AI pieces in the row and the ID of a blank space in the row (if any)
    lineResult = checkLine(i);
    //if green has two in the row and there is one blank space
    if (lineResult[1] === 2 && lineResult[0] === 0) {
      //the AI chooses the blank space in that row
      return lineResult[2]
    }
    //if the player has two in the row and there is one blank space
    if (lineResult[1] === 0 && lineResult[0] === 2) {
      //the AI remembers that spot
      blueBlocker = lineResult[2];
    }
  }
  //if after all rows are checked, the AI didn't find any spots to win, but it found a spot that blocks the player
  if (blueBlocker != undefined) {
    //it chooses that spot to block the player
    return blueBlocker;
  }
  //otherwise it uses this function to choose one of the remaining spots
  return defaultMove();
}


function defaultMove() {

  //if the middle spot is free, the AI chooses it
  var dot = document.getElementsByClassName("11")[0];
  if (dot.classList.contains("blue") === false && dot.classList.contains("green") === false) {
    return dot;
  }
  //if the middle is not free, it adds all the empty spots into an array
  var empties = [];
  for (var i = 0; i < document.getElementsByClassName('board')[0].children.length; i++) {
    dot = document.getElementsByClassName('board')[0].children[i];
    if (dot.classList.contains("blue") === false && dot.classList.contains("green") === false) {
      empties[empties.length] = dot;
      //empty corner spots are added ito the array mulitple times depending on the ability variable
      if (i === 0 || i === 2 ||  i === 6 || i === 8) {
        var j = 0;
        while (j < ability) {
          empties[empties.length] = dot;
          j ++;
        }
      }
    }
  }
  //the AI then picks a random spot from the array
  return empties[Math.floor(Math.random()*empties.length)]
}
function checkEndGame() {
  var lineResult;

  //every line is checked
  for (var i = 1; i <= 8; i++) {
    lineResult = checkLine(i);
    //if the player has won
    if (lineResult[0] === 3) {
      alert("You Win!");
      //one is added to their score
      totals[0] ++;
      document.getElementById("blue-total").innerHTML = totals[0];
      moveCount = 0;
      return true;
    }
    //if the AI has won
    if (lineResult[1] === 3) {
      alert("You Lose!");
      //one is added to their score
      totals[1] ++;
      document.getElementById("green-total").innerHTML = totals[1];
      moveCount = 0;
      return true;
    }
  }
  //if there has now been nine moves
  moveCount ++;
  if (moveCount === 9) {
    alert("It's a draw.")
    //one is added to the number of draws
    totals[2] ++;
    document.getElementById("invisible-total").innerHTML = totals[2];
    moveCount = 0;
    return true;
  }
  //otherwise the function returns that the game hasn't ended
  return false;
}


function clearBoard() {
  //for each dot, the blue and green classes are removed to turn it back to normal
  var dots;
  dots = document.getElementsByClassName('board')[0].children;
  for (var i = 0; i < dots.length; i ++ ) {
    dots[i].classList.remove("blue");
    dots[i].classList.remove("green");
  }
}
