Feature: Minesweeper
Here are some definitions and aclarations about the syntax that will be used:

"(1, 2)" means row 1 column 2, understanding that there's no row 0 nor column 0
"x" stands for cell with a mine
"o" stands for a covered cell
"0" stands for an empty cell
"1" stands for a cell with 1 adjacent mine
"2" stands for a cell with 2 adjacent mines
"3" stands for a cell with 3 adjacent mines
"4" stands for a cell with 4 adjacent mines
"5" stands for a cell with 5 adjacent mines
"6" stands for a cell with 6 adjacent mines
"7" stands for a cell with 7 adjacent mines
"8" stands for a cell with 8 adjacent mines

"Suspected cell" stands for a cell that is tagged as "!" meaning there's a potential mine on it,
whereas "questionable cell" stands for a cell tagged as "?" meaning it isn't exactly known the value of the cell.

Also, to load the mock data, it'll be used the following syntax:
"ooo-oxo-ooo" stands for a 3x3 board, where the "-" defines when a new row does start.
So "xo" would define a 1 row and 2 columns board, and "xoo-ooo" a board with 2 rows and 3 columns. 

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
Given the user loads the following mock data: "xo"
When the user discovers the cell "(1, 1)"
Then the cell "(1, 1)" should show a mine
And the game should be over

Scenario: Game over: Board status
Given the user loads the following mock data: "xox-ooo-oxo"
When the user discovers the cell "(1, 1)"
Then the game is over
And the following cells: "(1, 3)", "(3, 2)" should be discovered
And the cells "(1, 3)", "(3, 2)" should show a mine
And all the cells should be disabled

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


Scenario: Win the game
Given the user loads the following mock data: "ooo-xox-ooo"
When the user discovers the cells "(1, 1)", "(1, 2)", "(1, 3)", "(2, 2)", "(3, 1)", "(3, 2)", "(3, 3)"
Then the user has won the game

Scenario: Wining the game: board status
When the user wins the game
Then all the cells should be disabled 

Scenario: Discovering a cell: Empty cell
Given there's an empty cell
When the user clicks on it
Then the cell should be discovered
And the cell should be disabled
And also all the adjacent cells that are also empty should be discovered and disabled
And also all the cells that sourround all those empty cells should be discovered and disabled

Scenario: Discovering a cell: Empty cell -> Expand the discovering to other empty cells
Given the user loads the following mock data: "oooo-oooo-oxoo-oooo"
When the user discovers the cell "(1, 1)"
Then all the following cells should be discovered: "(1, 2)", "(1, 3)", "(1, 4)", "(2, 1)", "(2, 2)", "(2, 3)" "(2, 4)", "(3, 3)", "(3, 4)", "(4, 3)", "(4, 4)"
And the cells "(2, 1)", "(2, 2)", "(2, 3)", "(3, 4)", "(4, 3)" should show the value 1
And the cells "(1, 2)", "(1, 3)", "(1, 4)", "(3, 4)", "(4, 4)" should be empty

oooo
111o
1x1o
111o

"-------------------> Mouse scenarios"
Scenario: Restart button
When the user clicks the restart button
Then the display should show all the cells covered
And the 10 mines should be replaced 

Scenario: Click on a discovered/disabled cell
When the user clicks on a discovered cell
Then nothing should happen (need to define it better)

Scenario: Right click on a discovered/disabled cell
When the user right clicks on a discovered cell
Then nothing should happen (need to define it better)
