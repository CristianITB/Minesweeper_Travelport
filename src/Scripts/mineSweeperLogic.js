export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked"
}

//Haure de canviar el board size per ser un array amb les variables x i y o algo aixi per quan faci servir mock data
export function createBoard(boardSize, numberOfMines){
    const board = []
    const minePoisitions = getMinePositions(boardSize, numberOfMines)

    for(let x = 0; x < boardSize; x++){
        const row = []
        for(let y = 0; y < boardSize; y++){
            const element = document.createElement("div")
            element.dataset.status = TILE_STATUSES.HIDDEN
            const tile = {
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
            row.push(tile)
        }
        board.push(row)
    }
    return board
}

function getMinePositions(boardSize, numberOfMines){
    const positions = []

    while(positions.length < numberOfMines){
        const position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize)
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


export function markTile(tile){
    if(tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED){
        return 
    }
    if(tile.status === TILE_STATUSES.MARKED){
        tile.status = TILE_STATUSES.HIDDEN
    } else{
        tile.status = TILE_STATUSES.MARKED
    }
}

export function discoverCell(board, tile){
    if(tile.status !== TILE_STATUSES.HIDDEN){
        return
    }

    if(tile.mine){
        tile.status = TILE_STATUSES.MINE
        return
    }

    tile.status = TILE_STATUSES.NUMBER
    const adjacentCells = getAdjacentCells(board, tile)
    const mines = adjacentCells.filter(t => t.mine)
    if(mines.length === 0){
        adjacentCells.forEach(discoverCell.bind(null, board))  //aqui ocurre la magia de destapar las empty
    } else{
        tile.element.textContent = mines.length
    }
}

function getAdjacentCells(board, {x, y}){
    const tiles = []

    for(let xCells = -1; xCells <= 1; xCells++){
        for(let yCells = -1; yCells <= 1; yCells++){
            const tile = board[x + xCells]?.[y + yCells]
            if(tile){
                tiles.push(tile)
            } 
        }
    }
    return tiles
}

export function checkWin(board){
    return board.every(row =>{
        return row.every(tile =>{
            return (tile.status === TILE_STATUSES.NUMBER || 
                   (tile.mine && (tile.status === TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.MARKED)))
        })
    })
}

//if a single mine is discovered => lose
export function checkLose(board){
    return board.some(row =>{
        return row.some(tile =>{
            return tile.status === TILE_STATUSES.MINE
        })
    })
}