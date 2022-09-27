Feature: Minesweeper
Here are some definitions and aclarations about the syntax that will be used:

For the mock data:
"(1, 2)" means row 1 column 2, understanding that there's no row 0 nor column 0
"x" stands for cell with a mine
"o" stands for an empty cell

For the board display:
"#" stands for a covered cell
"*" stands for a cell with a mine
"0" stands for an empty cell
"1" stands for a cell with 1 adjacent mine
"2" stands for a cell with 2 adjacent mines
"3" stands for a cell with 3 adjacent mines
"4" stands for a cell with 4 adjacent mines
"5" stands for a cell with 5 adjacent mines
"6" stands for a cell with 6 adjacent mines
"7" stands for a cell with 7 adjacent mines
"8" stands for a cell with 8 adjacent mines
"!" stands for a covered cell with a mine tag

"Suspected cell" stands for a cell that is tagged as "!" meaning there's a potential mine on it.

Also, to load the mock data, it'll be used the following syntax:
"ooo-oxo-ooo" stands for a 3x3 board, where the "-" defines when a new row does start.
So "ox" would define a 1 row and 2 columns board, and "xoo-ooo" a board with 2 rows and 3 columns. 

Background:
Given a user opens the app

Scenario: Default screen
Then the display should show an 8x8 cells board
And all the cells should be covered

Scenario: Discovering a cell: General behaviour (disabled)
Given the user loads the following mock data: "xox-ooo"
When the user discovers the cell "(1, 2)"
Then the cell "(1, 2)" should be disabled

Scenario: Discovering a cell: Cell with a mine -> Game over
Given the user loads the following mock data: "ox"
When the user discovers the cell "(1, 2)"
Then the cell "(1, 2)" should show a mine
And the game should be over

Scenario: Game over: Discovering all mines
Given the user loads the following mock data: "xox-ooo-oxo"
When the user discovers the cell "(1, 1)"
Then the following cells: "(1, 1)", "(1, 3)", "(3, 2)" should be discovered
And the cells "(1, 1)", "(1, 3)", "(3, 2)" should show a mine
And the board display should show the following value: "*#*-###-#*#"

Scenario: Game over: Disabling all the board
Given the user loads the following mock data: "ox"
When the user discovers the cell "(1, 2)"
Then all the board cells should be disabled

Scenario Outline: Discovering a cell: Cell without mine, but with adjacent mined cells -> Should show the number of adjacent mines
Given the user loads the following mock data: "<mockData>"
When the user discovers the cell "(2, 2)"  
Then the cell "(2, 2)" should show the following value: "<cellValue>"

Examples: 
|  mockData   | cellValue |
| ooo-xoo-ooo |     1     |
| xox-ooo-ooo |     2     |
| xoo-xoo-oox |     3     |
| xox-xox-ooo |     4     |
| xxx-xoo-oxo |     5     |
| xox-oox-xxx |     6     |
| xxx-xox-xox |     7     |
| xxx-xox-xxx |     8     |


Scenario: Discovering all the non-mined cells: Win the game
Given the user loads the following mock data: "ox-xx"
When the user discovers the cell "(1, 1)"
Then the user should win the game

Scenario: Wining the game: Disabling all the board
Given the user loads the following mock data: "ox"
When the user discovers the cell "(1, 1)"
Then all the board cells should be disabled

Scenario: Discovering a cell: Empty cell -> All the adjacent cells should be discovered 
Given the user loads the followig mock data: "xooox"
When the user discovers the cell "(1, 3)"
Then the board display should show the following value: "#101#"

Scenario: Discovering a cell: Empty cell -> Expand the discovering to other empty cells
Given the user loads the following mock data: "oooo-oooo-oxoo-oooo"
When the user discovers the cell "(1, 1)"
Then the board display should show the following value: "0000-1110-##10-##10"

Scenario: Discovering an adjacent cell when a cell has been discovered by another adjacent empty cell
Given the user loads the following mock data: "ooox"
When the user discovers the cell "(1, 1)"
Then the cell "(1, 2)" should be discovered
And the cell "(1, 3)" should be discovered
And the board disply should show the following value: "001#"


"-------------------> Tagging scenarios"

Scenario: Tagging a cell: if the user believes there's a mine in a cell, it can be tagged as suspected
Given the user loads the following mock data: "ox"
When the user tags the cell "(1, 2)" as suspected
Then the board display should show the following value: "#!"

Scenario: Untag a suspected cell --------------------> if we follow the example of http://birrell.org/andrew/minesweeper/ this scenario is impossible
Given the user loads the following mock data: "ox"
And the user tags de cell "(1, 2)" as suspected
And the board display shows the following value: "#!"
When the user untags the cell "(1, 2)"
Then the board display should show the following value: "##"

Scenario: Game over with cells tagged as suspected: Discover all the mines except the ones tagged as suspected
Given the user loads the following mock data: "oxxox"
And the user tags the cell "(1, 2)" as suspected
And the board display shows the following value: "#!###"
When the user discovers the cell "(1, 3)"
Then the board display should show the followin value: "#!*#*"

Scenario: Wining the game: Tag all the remaining mines as suspected
Given the user loads the following mock data: "oxxox"
And the user tags the cell "(1, 2)" as suspected
When the user discovers the following cells: "(1, 1)", "(1, 4)"
Then the board display should be: "1!!2!"
