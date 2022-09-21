Feature: Minesweeper
Here are some definitions and aclarations about the syntax that will be used:

"1, 2" means row 1 column 2, understanding that there's no row 0 nor column 0
"x" stands for cell with a mine
"o" stands for an empty cell
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

Scenario: Discovering a cell: Cell with a mine -> Game over
Given the user loads the following mock data: "xo"
When the user discovers the cell "1, 1"
Then the cell "1, 1" should show a bomb
And the game should be over
And all the non-marked as suspected mines should be discovered  ---------------> doesnt make sense in this "xo" scenario

Scenario Outline: Discovering a cell: Cell without mine, but with adjacent mined cells -> Should show the number of adjacent mines
Given the user loads the following mock data: "<mockData>"
When the user discovers the cell "2, 2"  
Then the cell "2, 2" should show the following value: "<cellValue>"

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
Given the user has discovered all the cells except 9 mines + 1 random cell
When the user clicks on the random cell
Then the random cell should be discovered
And the missing mine should automatically be marked as suspected
And the timeCounter should stop increasing
And the mineCounter should show the following value: "0"
And all the cells should be disabled except the "face icon" key

Scenario: Status of the panel when the game is over
...
...


Scenario: Click on an empty cell
Given there's an empty cell
When the user clicks on it
Then the cell should be discovered
And the cell should be disabled
And also all the adjacent cells that are also empty should be discovered and disabled
And also all the cells that sourround all those empty cells should be discovered and disabled

Scenario: Click on a non-empty cell
Given there's a covered non-empty cell
When the user clicks on it
Then the cell should be discovered
And the cell should be disabled
And the cell should show its value
And aqui falta posar un outline example de si te value 1 show 1, value bomb show bomb etc

Scenario: Click on a discovered/disabled cell
Given the game has started (need to define it better)
When the user clicks on a discovered cell
Then nothing should happen (need to define it better)

Scenario: Right click on a discovered/disabled cell
Given the game has started (need to define it better)
When the user right clicks on a discovered cell
Then nothing should happen (need to define it better)

Scenario: Game start with click
Given the game hasn't started (need to define it better)
When the user clicks on any cell
Then the cell should be discovered 
And the cell should be disabled
And the timeCounter should start increasing

Scenario: Game start with right click
Given the game hasn't started (need to define it better)
When the user right clicks on any cell
Then the cell should be marked as suspected cell  
And the timeCounter should start increasing

Scenario: Pressing the face icon
Given the game has started (need to define it better)
When the user clicks the "face icon" key
Then the display should show all the cells covered
And the 10 mines should be replaced 
And the timeCounter should be empty

Scenario: Pressing the face icon bis
Given the game has started (need to define it better)
When the user clicks the "face icon" key
Then the game should be restarted
And the 10 mines should be replaced