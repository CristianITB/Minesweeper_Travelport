Feature: Minesweeper (Specific)
This is an ampliation of the core feature file.
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
"!" stands for a covered cell with a suspected mine tag
"?" stands for a covered cell with a questionable mine tag


"Suspected cell" stands for a cell that is tagged as "!" meaning there's a potential mine on it,
whereas "questionable cell" stands for a cell tagged as "?" meaning it isn't exactly known the value of the cell.

Also, to load the mock data, it'll be used the following syntax:
"ooo-oxo-ooo" stands for a 3x3 board, where the "-" defines when a new row does start.
So "ox" would define a 1 row and 2 columns board, and "xoo-ooo" a board with 2 rows and 3 columns.


Background:
Given a user opens the app

Scenario Outline: Default screen values: Untagged mines counter
Given the user loads the following mock data: "<mockData>"
Then the untagged mines counter should be set at: "<untaggedMinesCounter>"

Examples: 

|    mockData    | unatggedMinesCounter |
|    xoo-ooo     |          1           |
|    xxx-ooo     |          3           |
|    xxx-oox     |          4           |
|  xxx-oxx-xxo   |          7           |
|  xxx-oxx-xxx   |          8           |


Scenario Outline: Default screen values: Time counter
Then the time display should be empty

Scenario: Tagging a cell: if the user doesn't know the value of a cell, it can be tagged as questionable
When the user tags the cell "(1, 1)" as questionable
Then the cell "(1, 1)" should show the questionable tag

Scenario: Untag a questionable cell
And the cell "(1, 1)" is tagged as questionable
When the user untags the cell "(1, 1)"
Then the cell "(1, 1)" shouldn't show the questionable tag 

Scenario: Tagging a cell as suspected -> Untagged mines counter decreases
Given the user loads the following mock data: "ox"
And the untagged mines counter is 1
When the user tags the cell "(1, 1)" as suspected
Then the untagged mines counter should be 0

Scenario: Tagging a suspected cell as questionable -> Untagged mines counter increases
Given the user loads the following mock data: "ox"
And the user tags the cell "(1, 1)" as suspected
And the untagged mines counter is 0
When the user tags the cell "(1, 1)" as questionable
And the untagged mines counter should be 1

Scenario: Discovering a cell: Cell tagged as suspected -> Increase untagged mines counter
Given the user loads the following mock data: "oxo"
And the user tags the cell "(1, 1)" as suspected
And the untagged mines counter is 0
When the user discovers the cell "(1, 1)"
Then the untagged mines counter display should be 1

@manual
Scenario Outline: Increase time counter
Given the time display shows the following value: "<time display>"
When a second has passed
Then the time display should show the following value: "<time display result>"

Examples:
| time display | time display result | 
|       0      |           1         |
|       1      |           2         |
|       3      |           4         |
|      10      |          11         |
|      35      |          36         |

Scenario: Time counter limit
Given the user loads the following time mock data: "995"
When 4 seconds have passed
Then the time display should show the following value: "∞"

@manual
Scenario: Game starts by tagging as suspected -> Time counter starts increasing
Given the user loads the following mock data: "ox"
And the time display is empty
When the user tags the cell "(1, 1)" as suspected
Then the time counter should be 1

@manual
Scenario: Game starts by tagging as questionable -> Time counter starts increasing
Given the user loads the following mock data: "ox"
And the time display is empty
When the user tags the cell "(1, 1)" as questionable
Then the time counter should be 1

@manual
Scenario: Game starts by discovering -> Time counter starts increasing
Given the user loads the following mock data: "ox"
And the time display is empty
When the user discovers the cell "(1, 1)"
Then the time counter should be 1

@manual
Scenario: Game over: Time display stops increasing
Given the user loads the following mock data: "ox"
When a few seconds have passed 
And the user discovers the cell "(1, 2)"
Then the time display should stop increasing

@manual
Scenario: Wining the game: Time display stops increasing
Given the user loads the following mock data: "ox"
When a few seconds have passed 
And the user discovers the cell "(1, 1)"
Then the time display should stop increasing

Scenario: Restart button
Given the user loads the following mock data: 
"""
ooo
ooo
ooo
***
"""
And the user discovers the cell "(3, 1)"
And the user tags de cell "(4, 1)" as questionable
And the user tags the cell "(4, 2)" as suspected
And the user discovers the cell "(1, 1)"
When the user restarts the game
Then all the cells should be covered
And all the cells should be enabled
And the time display should be empty
And the untagged mines counter should be 3

@mouse
Scenario: Change tag from suspected to questionable with the mouse
Given the user loads the following mock data: "ox"
And the cell "(1, 1)" is tagged as suspected
And the untagged mines counter is 0
When the user right clicks on the cell "(1, 1)"
Then the cell "(1, 1)" should be tagged as questionable
And the untagged mines counter should be 1
