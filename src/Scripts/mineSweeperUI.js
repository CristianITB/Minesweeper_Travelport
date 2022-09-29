import { createBoard } from "./mineSweeperLogic.js";

const board_size = 10
const number_of_mines = 2

const board = (createBoard(board_size, number_of_mines))
const boardElement = document.querySelector(".board")

//Setting up the board
board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
    })
})
boardElement.style.setProperty("--size", board_size)
