export const Cell_Status = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    SUSPECTED: "suspected",
    EMPTY: "empty",                 //"empty" wasn't really necessary, but was usefull for testing
    QUESTIONABLE: "questionable"
}

export function createBoard(numberOfRows, numberOfColumns, numberOfMines, minePositionsMockData){
    var minePositions = null
    if(minePositionsMockData == null){
        minePositions = getMinePositions(numberOfRows, numberOfColumns, numberOfMines) 
    } else{
        minePositions = minePositionsMockData
    }
    
    const board = []

    for(let x = 0; x < numberOfRows; x++){
        const row = []
        for(let y = 0; y < numberOfColumns; y++){
            const element = document.createElement("div")
            element.dataset.status = Cell_Status.HIDDEN
            let xCorrected = x+1
            let yCorrected = y+1
            element.setAttribute("data-testid", "(" + xCorrected + ", " + yCorrected + ")")

            const cell = {
                element,
                x,
                y,
                mine: minePositions.some(positionMatch.bind(null, {x, y})),  //checks if the positoins in "minePositions" matches de x, y coord above. If they match, mine = true
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
            x: getRandomNumber(numberOfRows),
            y: getRandomNumber(numberOfColumns)
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

function getRandomNumber(size){
    return Math.floor(Math.random() * size)
}

export function tagCell(cell){
    if(cell.status === Cell_Status.HIDDEN){
        cell.status = Cell_Status.SUSPECTED
        cell.element.textContent = "!"
    } else if(cell.status === Cell_Status.SUSPECTED){
        cell.status = Cell_Status.QUESTIONABLE
        cell.element.textContent = "?"
    } else if(cell.status === Cell_Status.QUESTIONABLE){
        cell.status = Cell_Status.HIDDEN
        cell.element.textContent = ""
    } else{
        return
    }
}

export function discoverCell(board, cell){
    if(cell.status !== Cell_Status.HIDDEN && cell.status !== Cell_Status.SUSPECTED && cell.status !== Cell_Status.QUESTIONABLE){
        return
    }

    if(cell.mine){
        cell.element.setAttribute("disabled", true)
        cell.status = Cell_Status.MINE
        return
    }

    cell.element.textContent = ""
    cell.status = Cell_Status.NUMBER
    const adjacentCells = getAdjacentCells(board, cell)
    const mines = adjacentCells.filter(adjacentCell => adjacentCell.mine)

    if(mines.length === 0){
        cell.element.setAttribute("disabled", true)
        cell.status = Cell_Status.EMPTY
        adjacentCells.forEach(discoverCell.bind(null, board))  //aqui ocurre la magia de destapar las empty
    } else{
        cell.element.setAttribute("disabled", true)
        cell.element.textContent = mines.length;
        cell.element.classList.add("mines"+ mines.length)
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
            return (cell.status === Cell_Status.NUMBER || cell.status === Cell_Status.EMPTY ||
                   (cell.mine && (cell.status === Cell_Status.HIDDEN || cell.status === Cell_Status.SUSPECTED))
                   )
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

export function tagAllMines(board){
    board.forEach(row =>{
        row.forEach(cell =>{
            if(cell.mine){
                cell.element.setAttribute("disabled", true)
                cell.status = Cell_Status.SUSPECTED
                cell.element.textContent = "!"
            }
        })
    })
}
