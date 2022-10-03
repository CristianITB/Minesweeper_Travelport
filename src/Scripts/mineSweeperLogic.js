export const Cell_Status = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked"
}

//Haure de canviar el board size per ser un array amb les variables x i y o algo aixi per quan faci servir mock data
export function createBoard(numberOfRows, numberOfColumns, numberOfMines){
    
    const board = []
    const minePoisitions = getMinePositions(numberOfRows, numberOfColumns, numberOfMines)

    for(let x = 0; x < numberOfRows; x++){
        const row = []
        for(let y = 0; y < numberOfColumns; y++){
            const element = document.createElement("div")
            element.dataset.status = Cell_Status.HIDDEN
            const cell = {
                element,
                x,
                y,
                mine: minePoisitions.some(positionMatch.bind(null, {x, y})),  //checks if the positoins in "minePositions" matches de x, y coord above. If they match, mine = true
                get status(){
                    return this.element.dataset.status
                },
                set status(value){
                    this.element.dataset.status = value
                }
            }
            row.push(cell)
        }
        board.push(row)
    }
    return board
}

function getMinePositions(numberOfRows, numberOfColumns, numberOfMines){
    const positions = []

    while(positions.length < numberOfMines){
        const position = {
            x: randomNumber(numberOfRows),
            y: randomNumber(numberOfColumns)
        }

        //"some" returns true if at least one of the elements of the array matches the thing. The inside "p =>...is like a for each position"
        //if(positions.some(p => positionMatch(p, position))){
        //it can also be used the "bine" just to make it shorter
        if(!positions.some(positionMatch.bind(null, position))){
            positions.push(position)
        }
    }
    return positions
}

//This function checks if a and b have the same coords
function positionMatch(a, b){
    return a.x === b.x && a.y === b.y
}

function randomNumber(size){
    return Math.floor(Math.random() * size)
}


export function markCell(cell){
    if(cell.status !== Cell_Status.HIDDEN && cell.status !== Cell_Status.MARKED){
        return 
    }
    if(cell.status === Cell_Status.MARKED){
        cell.status = Cell_Status.HIDDEN
    } else{
        cell.status = Cell_Status.MARKED
    }
}

export function discoverCell(board, cell){
    if(cell.status !== Cell_Status.HIDDEN){
        return
    }

    if(cell.mine){
        cell.status = Cell_Status.MINE
        cell.disabled = true
        return
    }

    cell.status = Cell_Status.NUMBER
    const adjacentCells = getAdjacentCells(board, cell)
    const mines = adjacentCells.filter(c => c.mine)

    if(mines.length === 0){
        cell.disabled = true
        adjacentCells.forEach(discoverCell.bind(null, board))  //aqui ocurre la magia de destapar las empty
    } else{
        cell.element.textContent = mines.length
        cell.disabled = true
    }
}

function getAdjacentCells(board, {x, y}){
    const cells = []

    for(let xCells = -1; xCells <= 1; xCells++){
        for(let yCells = -1; yCells <= 1; yCells++){
            const cell = board[x + xCells]?.[y + yCells]
            if(cell){
                cells.push(cell)
            } 
        }
    }
    return cells
}

export function checkWin(board){
    return board.every(row =>{
        return row.every(cell =>{
            return (cell.status === Cell_Status.NUMBER || 
                   (cell.mine && (cell.status === Cell_Status.HIDDEN || cell.status === Cell_Status.MARKED)))
        })
    })
}

//if a single mine is discovered => lose
export function checkLose(board){
    return board.some(row =>{
        return row.some(cell =>{
            return cell.status === Cell_Status.MINE
        })
    })
}