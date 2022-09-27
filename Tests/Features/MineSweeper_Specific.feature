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
"!" stands for a covered cell with a mine tag

"Suspected cell" stands for a cell that is tagged as "!" meaning there's a potential mine on it,
whereas "questionable cell" stands for a cell tagged as "?" meaning it isn't exactly known the value of the cell.

Also, to load the mock data, it'll be used the following syntax:
"ooo-oxo-ooo" stands for a 3x3 board, where the "-" defines when a new row does start.
So "ox" would define a 1 row and 2 columns board, and "xoo-ooo" a board with 2 rows and 3 columns.

Background:
Given a user opens the app

Scenario: Default screen: Specific minesweeper
Then the untagged mine counter should be set at 10
And the time display should be empty

Scenario: Tagging a cell: if the user doesn't know the value of a cell, it can be tagged as questionable
Given the user loads the following mock data: "ox"
When the user tags the cell "(1, 1)" as questionable
Then the board display should show the following value: "?#"

Scenario: Untag a questionable cell
Given the user loads the following mock data: "ox"
And the cell "(1, 1)" is tagged as questionable
When the user untags the cell "(1, 1)"
Then the questionable tag in cell "(1, 1)" should be removed 

Scenario: Tagging a cell: if the user believes there's a mine in a cell, it can be tagged as suspected -> Mine counter decreases
Given the user loads the following mock data: "ox"
And untagged mine counter is 10
When the user tags the cell "(1, 1)" as suspected
Then the cell "(1, 1)" should show the tag "!"
And untagged mine counter should be 9

Scenario: Tagging a cell: if the user doesn't know the value of a cell, and the cell is tagged as suspected, it can be tagged as questionable -> Mine counter increases
Given the user loads the following mock data: "ox"
And untagged mine counter is 9
And the cell "(1, 1)" is tagged as suspected
When the user tags the cell "(1, 1)" as questionable
Then the cell "(1, 1)" should show the tag "?"
And untagged mine counter should be 10

Scenario: Discovering a cell: Cell tagged as suspected -> Increase untagged mine counter
Given the user loads the following mock data: "ox"
And the untagged mine counter is 9
And the cell "(1, 1)" is tagged as suspected
And the cell "(1, 1)" is not a mine ???????????????????????????????
When the user discovers the cell "(1, 1)"
Then the untagged mine counter display should be 10

Scenario: Discovering a cell: Cell tagged as questionable -> Increase untagged mine counter
Given the user loads the following mock data: "ox"
And the untagged mine counter is 9
And the cell "(1, 1)" is tagged as questionabe
And the cell "(1, 1)" is not a mine ???????????????????????????????
When the user discovers the cell "(1, 1)"
Then the untagged mine counter display should be 10


Scenario Outline: Increase time counter
Given the time display shows the following value: "<time display>"
When a second has passed
Then the time display should show the following value: "<time display result>"

Examples:
| time display | time display result | 
|       0      |           1         |
|       1      |           2         |
|      35      |          36         |
|     284      |         285         |
|     912      |         913         |

Scenario: Game starts by tagging as suspected -> Time counter starts increasing
Given the user loads the following mock data: "ox"
When the user tags the cell "(1, 1)" as suspected
Then the time counter should be 1

Scenario: Game starts by tagging as suspected -> Time counter starts increasing
Given the user loads the following mock data: "ox"
When the user tags the cell "(1, 1)" as questionable
Then the time counter should be 1

Scenario: Time counter limit
Given the time display show the following value: "999"
When a second has passed
Then the time display should show the following value: "∞"

Scenario: Game over: Time display stops increasing
Given the user loads the following mock data: "ox"
When the user discovers the cell "(1, 2)"
And the time display should stop increasing ?????????????????????

Scenario: Wining the game: Time display stops increasing
Given the user loads the following mock data: "ox"
When the user discovers the cell "(1, 1)"
Then the time display should stop increasing ?????????????????????

Scenario: Restart button ?????????????????
When the user restarts the game
Then the board display should be the default screen

Scenario: Game starts by discovering -> Time counter starts increasing
Given the user loads the following mock data: "ox"
When the user discovers the cell "(1, 1)"
Then the time counter should be 1

Scenario: Game starts by tagging as suspected -> Time counter starts increasing
Given the user loads the following mock data: "ox"
When the user tags the cell "(1, 1)" as suspected
Then the time counter should be 1

Scenario: Game starts by tagging as suspected -> Time counter starts increasing
Given the user loads the following mock data: "ox"
When the user tags the cell "(1, 1)" as questionable
Then the time counter should be 1


"-------------------> Mouse scenarios"
@Mouse
Scenario: Click on a discovered/disabled cell
When the user clicks on a discovered cell
Then nothing should happen (need to define it better)

@Mouse
Scenario: Right click on a discovered/disabled cell
When the user right clicks on a discovered cell
Then nothing should happen (need to define it better)

@Mouse
Scenario: Change tag from suspected to questionable with the mouse
Given the untagged mine counter is 9
And the cell "(1, 1)" is tagged as suspected
When the user right clicks on the cell "(1, 1)"
Then the cell "(1, 1)" should be tagged as questionable
And the untagged mine counter should be 10 

@Mouse
Scenario: Game start with right click
Given the game hasn't started (need to define it better)
When the user right clicks on any cell
Then the cell should be marked as suspected cell  
And the timeCounter should start increasing