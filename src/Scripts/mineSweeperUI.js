import { createBoard, markTile, TILE_STATUSES, discoverCell, checkWin, checkLose } from "./mineSweeperLogic.js";

const board_size = 8
const number_of_mines = 10

const board = (createBoard(board_size, number_of_mines))
const boardElement = document.querySelector(".board")
const untaggedMinesCounter = document.querySelector("[untagged-mines-counter]")
const messageText = document.querySelector(".subtext")

//Setting up the board
board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
        tile.element.addEventListener("click", () =>{
            discoverCell(board, tile)
            checkEndGame()
        })
        tile.element.addEventListener("contextmenu", e =>{
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
    })
})
boardElement.style.setProperty("--size", board_size)
untaggedMinesCounter.textContent = number_of_mines

function listMinesLeft(){
    const taggedCellsCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0) //it sets the count at 0
    untaggedMinesCounter.textContent =  number_of_mines - taggedCellsCount
}

function checkEndGame(){
    const win = checkWin(board)
    const lose = checkLose(board)

    if(win || lose){
        boardElement.addEventListener("click", stopProp, {capture: true}) //capture phase occurs before bubble phase, which is the one used in l.14
        boardElement.addEventListener("contextmenu", stopProp, {capture: true})
    }

    if(win){
        messageText.textContent = "You've won the game! Congratulations motherfucker"
    }

    if(lose){
        messageText.textContent = "You lost the game like you lose everything in life loser."
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.status === TILE_STATUSES.MARKED){
                    markTile(tile)  //if the tile is marked, it marks it again so it loses the mark...is like a toggle function
                }
                if (tile.mine){
                    discoverCell(board, tile)
                }
            })
        })
    }
}

//this function stops the event to go further, so if u win/lose, the cell """"won't be clicked"""""
function stopProp(e){
    e.stopImmediatePropagation()
}

