import { createBoard, markCell, Cell_Status, discoverCell, checkWin, checkLose } from "./mineSweeperLogic.js";

var numberOfRows = 8
var numberOfColumns = 8
var numberOfMines = 10

/* ---------- Mock Data Management -----------*/
var minePositionsMockData = null

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const mockData = urlParams.get('mockData')


if(mockData != null){
    const splittedMockData = splitMockData(mockData)
    numberOfRows = splittedMockData.length
    numberOfColumns = splittedMockData[0].length
    minePositionsMockData = getMineMockDataPositions(splittedMockData)
    numberOfMines = minePositionsMockData.length
}

function splitMockData(mockData) {
    if(mockData.includes("-")){
        return mockData.split("-")
    } else if(mockData.includes("\\n")){
        return mockData.split("\\n")
    }
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
    

const board = (createBoard(numberOfRows, numberOfColumns, numberOfMines, minePositionsMockData))
const boardElement = document.querySelector(".board")
const untaggedMinesCounter = document.querySelector("[untagged-mines-counter]")
const messageText = document.querySelector(".subtext")

//Setting up the board
board.forEach(row => {
    row.forEach(cell => {
        boardElement.append(cell.element)
        cell.element.addEventListener("click", () =>{
            discoverCell(board, cell)
            checkEndGame()
        })
        cell.element.addEventListener("contextmenu", e =>{
            e.preventDefault()
            markCell(cell)
            listMinesLeft()
        })
    })
})
boardElement.style.setProperty("--rowsSize", numberOfRows)
boardElement.style.setProperty("--columnsSize", numberOfColumns)
untaggedMinesCounter.textContent = numberOfMines

function listMinesLeft(){
    const taggedCellsCount = board.reduce((count, row) => {
        return count + row.filter(cell => cell.status === Cell_Status.MARKED).length
    }, 0) //it sets the count at 0
    untaggedMinesCounter.textContent = numberOfMines - taggedCellsCount
}

function checkEndGame(){
    const win = checkWin(board)
    const lose = checkLose(board)

    if(win || lose){
        boardElement.addEventListener("click", stopProp, {capture: true}) //capture phase occurs before bubble phase, which is the one used in l.14
        boardElement.addEventListener("contextmenu", stopProp, {capture: true})
    }

    if(win){
        messageText.textContent = "You've won the game! Congratulations motherfucker."
    }

    if(lose){
        console.log(document.querySelector(".board").innerHTML)
        messageText.textContent = "You lost the game like you lose everything in life loser."
        board.forEach(row => {
            row.forEach(cell => {
                if(cell.status === Cell_Status.MARKED){
                    markCell(cell)  //if the cell is marked, it marks it again so it loses the mark...is like a toggle function
                }
                if (cell.mine){
                    discoverCell(board, cell)
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
})
