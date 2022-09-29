const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked"
}

//Haure de canviar el board size per ser un array amb les variables x i y o algo aixi per quan faci servir mock data
export function createBoard(boardSize, numberOfMines){
    const board = []
    const minePoisitions = getMinePositions(boardSize, numberOfMines)
    console.log(minePoisitions)

    for(let x = 0; x < boardSize; x++){
        const row = []
        for(let y = 0; y < boardSize; y++){
            const element = document.createElement("div")
            element.dataset.status = TILE_STATUSES.HIDDEN
            const tile = {
                element,
                x,
                y,
                mine: true,
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



//MINUTO 18:00 https://www.youtube.com/watch?v=kBMnD_aElCQ&list=WL&index=68&t=553s&ab_channel=WebDevSimplified