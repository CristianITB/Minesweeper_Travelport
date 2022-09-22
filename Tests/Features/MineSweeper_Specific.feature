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

Scenario: Default screen Specific
Then the display should show an 8x8 cells board
And all the cells should be covered
And the mineCounter should be set at 10
And the timeDisplay should be empty

Scenario: Discovering a cell: Cell with a mine -> Game over
Given the user loads the following mock data: "xo"
When the user discovers the cell "1, 1"
Then the cell "1, 1" should show a bomb
And the game should be over
And all the non-marked as suspected mines should be discovered  ---------------> doesnt make sense in this "xo" scenario

Scenario: Game over when clicking on a bomb
When the user clicks on a bomb
Then all the non-marked as suspected mines should be discovered
And the timeCounter should stop increasing
And all the cells should be disabled except the "face icon" key

"A partir d'aqui, no haurien de tenir totes un given que sigui: Given the user loads the following mock data: ......??????"
Scenario: Tagging a cell: if the user believes there's a mine in a cell, it can be tagged as suspected -> mine counter decreases
Given "mineCounter" is 10
When the user tags the cell "1, 1" as suspected
Then the cell "1, 1" should show the tag "!"
And "mineCounter" should be 9

Scenario: Tagging a cell: if the user doesn't know the value of a cell, it can be tagged as questionable
When the user tags the cell "1, 1" as questionable
Then the cell "1, 1" should show the tag "?"

Scenario: Tagging a cell: if the user doesn't know the value of a cell, and the cell is tagged a suspected it can be tagged as questionable -> mine counter increases
Given "mineCounter" is 9
And the cell "1, 1" is tagged as suspected
When the user tags the cell "1, 1" as questionable
Then the cell "1, 1" should show the tag "?"
And "mineCounter" should be 10

Scenario: Change tag from suspected to questionable with the mouse
Given the "mineCounter" is 9
And the cell "1, 1" is tagged as suspected
When the user right clicks on the cell "1, 1"
Then the cell "1, 1" should be tagged as questionable
And the "mineCounter" should be 10 

Scenario: Untag a suspected cell --------------------> if we follow the example of http://birrell.org/andrew/minesweeper/ this scenario is impossible 
Given the cell "1, 1" is tagged as suspected
When the user untags the cell "1, 1"
Then the suspected tag in cell "1, 1" should be removed 

Scenario: Untag a questionable cell
Given the cell "1, 1" is tagged as questionable
When the user untags the cell "1, 1"
Then the questionable tag in cell "1, 1" should be removed 

Scenario Outline: Reduce mine counter when tagging a cell as suspected
Given the mineCounter display shows the following value: "<mineCounterDisplay>"
When the user tags the cell "1, 1" as suspected
Then the mineCounter display should show the following value: "<displayResult>"

Examples:
| mineCounterDisplay | displayResult |
|          10        |       9       |
|           9        |       8       |
|           3        |       2       |
|           1        |       0       |
|           0        |      -1       |
|          -1        |      -2       |


Scenario Outline: Increase mine counter when tagging a cell as questionable
Given the mineCounter display shows the following value: "<mineCounterDisplay>"
And the cell "1, 1" is tagged as suspected
When the user tags the cell "1, 1" as questionable
Then the mineCounter display should show the following value: "<displayResult>"

Examples:
| mineCounterDisplay | displayResult |
|           9        |      10       |
|           8        |       9       |
|           1        |       2       |
|           0        |       1       |
|          -1        |       0       |
|          -2        |      -1       |



"-------------------------------------> Aquests dos scenarios son una mica nye pq tenen el cas limit en que descobreixes una bomba -> es pot arreglar si given loads mock data..."
Scenario Outline: Increase mine counter when discovering a suspected cell
Given the mineCounter display shows the following value: "<mineCounterDisplay>"
And the cell "1, 1" is tagged as suspected
When the user discovers the cell "1, 1"
Then the mineCounter display should show the following value: "<displayResult>"

Examples:
| mineCounterDisplay | displayResult |
|           9        |      10       |
|           8        |       9       |
|           1        |       2       |
|           0        |       1       |
|          -1        |       0       |
|          -2        |      -1       |


Scenario Outline: Increase mine counter when discovering a questionable cell
Given the mineCounter display shows the following value: "<mineCounterDisplay>"
And the cell "1, 1" is tagged as questionabe
When the user discovers the cell "1, 1"
Then the mineCounter display should show the following value: "<displayResult>"

Examples:
| mineCounterDisplay | displayResult |
|           9        |      10       |
|           8        |       9       |
|           1        |       2       |
|           0        |       1       |
|          -1        |       0       |
|          -2        |      -1       |
"-----------------------------------------------"



Scenario Outline: Increase time counter
Given the time display shows the following value: "<timeDisplay>"
When a second has passed
Then the time display should show the following value: "<displayResult>"

Examples:
| timeDisplay | displayResult |
|       0     |       1       |
|       1     |       2       |
|      35     |      36       |
|     284     |     285       |
|     912     |     913       |


Scenario: Time counter limit
Given the time display show the following value: "999"
When a second has passed
Then the timeDisplay should show the following value: "∞"

Scenario: Click on a suspected cell
Given there's a cell with a suspected mark
When the user clicks on it
Then the cell should be discovered
And the cell should be disabled

Scenario: Click on a questionable cell
Given there's a cell with a questionable mark
When the user clicks on it
Then the cell should be discovered
And the cell should be disabled

Scenario: Game start with right click
Given the game hasn't started (need to define it better)
When the user right clicks on any cell
Then the cell should be marked as suspected cell  
And the timeCounter should start increasing
