import { createBoard, tagCell, Cell_Status, discoverCell, checkWin, checkLose, tagAllMines } from "./mineSweeperLogic.js";

var numberOfRows = 8;
var numberOfColumns = 8;
var numberOfMines = 10;

/* ---------- Timer ---------- */
var seconds = 0;
var interval = null;

/* ---------- Mock Data Management -----------*/
var minePositionsMockData = null;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const mockData = urlParams.get('mockData');

if(mockData != null && checkMockData(mockData)){
    const splittedMockData = splitMockData(mockData);
    numberOfRows = splittedMockData.length;
    numberOfColumns = splittedMockData[0].length;
    minePositionsMockData = getMineMockDataPositions(splittedMockData);
    numberOfMines = minePositionsMockData.length;
} else if(mockData != null){
    window.alert("Mock data has a typo error. Please, check it and try to reconnect.");
}

function checkMockData(mockData){
    let mockDataIsFine = true;
    for(let i = 0; i < mockData.length; i++){
        if (!["x", "o", "-"].includes(mockData[i])) {
            mockDataIsFine = false;
            break;
        }
    }
    return mockDataIsFine;
}

function splitMockData(mockData) {
    return mockData.split("-");
}
    
function getMineMockDataPositions(splittedMockData){
    const minePositions = [];
    for(let i = 0; i < splittedMockData.length; i++){
        for(let j = 0; j < splittedMockData[0].length; j++){            
            if(splittedMockData[i][j] == "x"){
                const position = {
                    x: i,
                    y: j
                }
                minePositions.push(position);
            }  
        }
    }    
    return minePositions; 
}
/* ------------------------------------------ */
    
var board = (createBoard(numberOfRows, numberOfColumns, numberOfMines, minePositionsMockData));
var boardElement = document.querySelector(".board");
var messageText = document.querySelector(".subtext");
var untaggedMinesCounter = document.querySelector("[untagged-mines-counter]");

//Setting up the board
function setUpBoard(){
    board.forEach(row => {
        row.forEach(cell => {
            boardElement.append(cell.element)
            cell.element.addEventListener("click", () =>{
                startTimer();
                discoverCell(board, cell);
                checkEndGame();
                updateHTML()
                listMinesLeft();
            })
            cell.element.addEventListener("contextmenu", e =>{
                startTimer();
                e.preventDefault();
                tagCell(cell);
                updateHTML();
                listMinesLeft();
            })
        })
    })
}
setUpBoard();

function updateHTML(){
    board.forEach(row => {
        row.forEach(cell => {
            if(cell.status === Cell_Status.MINE){
                cell.element.classList.remove("hiddenCell")
                cell.element.classList.remove("suspectedCell")
                cell.element.classList.remove("questionableCell")

                cell.element.textContent = "💣"
                cell.element.setAttribute("disabled", true)
                cell.element.classList.add("minedCell")
                
            } else if(cell.status === Cell_Status.NUMBER){
                cell.element.classList.remove("hiddenCell")
                cell.element.classList.remove("suspectedCell")
                cell.element.classList.remove("questionableCell")

                cell.element.textContent = cell.numberOfAdjacentMines;
                cell.element.setAttribute("disabled", true)
                cell.element.classList.add("numberedCell")
                cell.element.classList.add("mines" + cell.numberOfAdjacentMines)

            } else if(cell.status === Cell_Status.EMPTY){
                cell.element.classList.remove("hiddenCell")
                cell.element.classList.remove("suspectedCell")
                cell.element.classList.remove("questionableCell")

                cell.element.textContent = ""
                cell.element.setAttribute("disabled", true)
                cell.element.classList.add("emptyCell")

            } else if(cell.status === Cell_Status.SUSPECTED){
                cell.element.classList.remove("hiddenCell")

                cell.element.textContent = "!"
                cell.element.setAttribute("disabled", true)
                cell.element.classList.add("suspectedCell")

            } else if(cell.status === Cell_Status.QUESTIONABLE){
                cell.element.classList.remove("hiddenCell")
                cell.element.classList.remove("suspectedCell")

                cell.element.textContent = "?"
                cell.element.classList.add("questionableCell")

            } else if(cell.status === Cell_Status.HIDDEN){
                cell.element.classList.remove("suspectedCell")
                cell.element.classList.remove("questionableCell")

                cell.element.textContent = ""
                cell.element.classList.add("hiddenCell")
            }
        })
    })
}

boardElement.style.setProperty("--rowsSize", numberOfRows);
boardElement.style.setProperty("--columnsSize", numberOfColumns);
untaggedMinesCounter.textContent = numberOfMines;

function listMinesLeft(){
    const taggedCellsCount = board.reduce((count, row) => {
        return count + row.filter(cell => cell.status === Cell_Status.SUSPECTED).length;
    }, 0); //it sets the count at 0
    untaggedMinesCounter.textContent = numberOfMines - taggedCellsCount;
}

function checkEndGame(){
    const win = checkWin(board);
    const lose = checkLose(board);

    if(win || lose){
        stopTimer();
        boardElement.addEventListener("click", stopProp, {capture: true}); //capture phase occurs before bubble phase, which is the one used in l.14
        boardElement.addEventListener("contextmenu", stopProp, {capture: true});
    }

    if(win){
        tagAllMines(board);
        messageText.textContent = "You've won the game! Congratulations!";
    }

    if(lose){
        messageText.textContent = "You lost the game! C'mon it was easy:(";
        board.forEach(row => {
            row.forEach(cell => {
                if (cell.mine && cell.status !== Cell_Status.SUSPECTED){
                    discoverCell(board, cell);
                } else if(!cell.mine && cell.status === Cell_Status.SUSPECTED){
                    cell.element.textContent = "❌"
                } else{
                    cell.element.setAttribute("disabled", true);
                }
            })
        })
    }
}

//this function stops the event to go further, so if u win/lose, the cell """"won't be clicked"""""
function stopProp(e){
    e.stopImmediatePropagation();
}

const restartButton = document.querySelector(".restartButton")
restartButton.addEventListener("click", () =>{
    resetBoard();
    setUpBoard();
})

function resetBoard(){
    resetTimer();
    document.querySelector(".board").innerHTML = "";

    messageText.innerText = "💣 Mines left: ";
    createMinesTextSpan()

    boardElement.removeEventListener("click", stopProp, {capture: true});
    boardElement.removeEventListener("contextmenu", stopProp, {capture: true});

    board = (createBoard(numberOfRows, numberOfColumns, numberOfMines, minePositionsMockData));
}

function createMinesTextSpan(){
    let minesSpan = document.createElement("span")
    minesSpan.setAttribute("untagged-mines-counter", "")
    minesSpan.innerHTML = numberOfMines
    messageText.appendChild(minesSpan)
    untaggedMinesCounter = document.querySelector("[untagged-mines-counter]");
}


/* ------- Timer functions ------- */
const timerDiv = document.querySelector('.timer');

function timer(){
	seconds++;

    let hrs = Math.floor(seconds / 3600);
	let mins = Math.floor((seconds - (hrs * 3600)) / 60);
	let secs = seconds % 60;

	if (secs < 10) secs = '0' + secs;
	if (mins < 10) mins = "0" + mins;
	if (hrs < 10) hrs = "0" + hrs;

	timerDiv.innerText = `⏳ ${hrs}:${mins}:${secs}`;
}

function startTimer(){
    if(interval == null){
        interval = setInterval(timer, 1000);
    } else{
        return
    }
}

function stopTimer(){
	clearInterval(interval);
	interval = null;
}

function resetTimer(){
	stopTimer();
	seconds = 0;
	timerDiv.innerText = '⏳ 00:00:00';
}
/* ------------------------------- */
