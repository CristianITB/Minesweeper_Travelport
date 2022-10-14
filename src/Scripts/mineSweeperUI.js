import { createBoard, tagCell, Cell_Status, discoverCell, checkWin, checkLose, tagAllMines, cleanBoardDisplay } from "./mineSweeperLogic.js";

var numberOfRows = 8
var numberOfColumns = 8
var numberOfMines = 10

/* ---------- Timer ---------- */
var seconds = 0;
var interval = null;

/* ---------- Mock Data Management -----------*/
var minePositionsMockData = null

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const mockData = urlParams.get('mockData')

if(mockData != null && checkMockData(mockData)){
    const splittedMockData = splitMockData(mockData)
    numberOfRows = splittedMockData.length
    numberOfColumns = splittedMockData[0].length
    minePositionsMockData = getMineMockDataPositions(splittedMockData)
    numberOfMines = minePositionsMockData.length
} else if(mockData != null){
    window.alert("Mock data has a typo error. Please check it and try to reconnect.")
}

function checkMockData(mockData){
    let mockDataIsFine = true
    for(let i = 0; i < mockData.length; i++){
        if(mockData[i] != "x" && mockData[i] != "o"){
            mockDataIsFine = false
            break
        }
    }
    return mockDataIsFine
}

function splitMockData(mockData) {
    return mockData.split("-")
}
    
function getMineMockDataPositions(splittedMockData){
    const minePositions = []
    for(let i = 0; i < splittedMockData.length; i++){
        for(let j = 0; j < splittedMockData[0].length; j++){            
            if(splittedMockData[i][j] == "x"){
                const position = {
                    x: i,
                    y: j
                }
                minePositions.push(position)
            }  
        }
    }    
    return minePositions    
}
/* ------------------------------------------ */
    
var board = (createBoard(numberOfRows, numberOfColumns, numberOfMines, minePositionsMockData))
var boardElement = document.querySelector(".board")
var untaggedMinesCounter = document.querySelector("[untagged-mines-counter]")
var messageText = document.querySelector(".subtext")

const count = boardElement.childNodes
//console.log(count)
//console.log(count.length)
//no aconsegueixo treure el nombre de child divs qe te el board, qe voldria saber-ho
//per poder fer el test de default screen show a 8x8 board

//Setting up the board
board.forEach(row => {
    row.forEach(cell => {
        boardElement.append(cell.element)
        cell.element.addEventListener("click", () =>{
            startTimer()
            discoverCell(board, cell)
            checkEndGame()
            listMinesLeft()
        })
        cell.element.addEventListener("contextmenu", e =>{
            startTimer()
            e.preventDefault()
            tagCell(cell)
            listMinesLeft()
        })
    })
})

boardElement.style.setProperty("--rowsSize", numberOfRows)
boardElement.style.setProperty("--columnsSize", numberOfColumns)
untaggedMinesCounter.textContent = numberOfMines

function listMinesLeft(){
    const taggedCellsCount = board.reduce((count, row) => {
        return count + row.filter(cell => cell.status === Cell_Status.SUSPECTED).length
    }, 0) //it sets the count at 0
    untaggedMinesCounter.textContent = numberOfMines - taggedCellsCount
}

function checkEndGame(){
    const win = checkWin(board)
    const lose = checkLose(board)

    if(win || lose){
        stopTimer();
        boardElement.addEventListener("click", stopProp, {capture: true}) //capture phase occurs before bubble phase, which is the one used in l.14
        boardElement.addEventListener("contextmenu", stopProp, {capture: true})
    }

    if(win){
        tagAllMines(board);
        messageText.textContent = "You've won the game! Congratulations motherfucker."
    }

    if(lose){
        messageText.textContent = "You lost the game like you lose everything in life loser."
        board.forEach(row => {
            row.forEach(cell => {
                if (cell.mine && cell.status !== Cell_Status.SUSPECTED){
                    discoverCell(board, cell)
                } else{
                    cell.element.setAttribute("disabled", true)
                }
            })
        })
    }
}

//this function stops the event to go further, so if u win/lose, the cell """"won't be clicked"""""
function stopProp(e){
    e.stopImmediatePropagation()
}

const restartButton = document.querySelector(".restartButton")
restartButton.addEventListener("click", () =>{
    location.reload();
    //board = resetBoard()
})

function resetBoard(){
    resetTimer()
    cleanBoardDisplay(board)
    let newBoard = (createBoard(numberOfRows, numberOfColumns, numberOfMines, minePositionsMockData))
    return newBoard
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

function getBoard(){
    return board
}
