Feature: Minesweeper

Background:
Given a user opens the app
It'd be understood that "left click" is just "click" and "right click" is "right click"

Scenario: Default display screen
Then the display should show a panel with 8x8 cells
And all the cells should be undiscovered
And the mineCounter should be set at 10
And the timeDisplay should be empty

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
Then the display should show all the cells undiscovered
And the 10 mines should be replaced 
And the timeCounter should be empty

Scenario: Pressing the face icon bis
Given the game has started (need to define it better)
When the user clicks the "face icon" key
Then the game should be restarted
And the 10 mines should be replaced

Scenario: Flag a suspected cell
Given there's an undiscovered cell
When the user rigth clicks on it
Then an exclamation symbol ("!") should appear on it

Scenario: Flag a questionable cell
Given there's a cell marked as suspected
When the user rigth clicks on it
Then the exclamation symbol ("!") should be erased
And an interrogation symbol ("?") should appear on it

Scenario: Unflag a questionable cell
Given there's a cell marked as questionable
When the user rigth clicks on it
Then the interrogation symbol ("?") should be erased
And the cell should remain undiscovered

Scenario Outline: Reduce mine counter
Given the mineCounter display shows the following value: "<mineCounterDisplay>"
When the user marks a cell as suspected
Then the mineCounter display should show the following value: "<displayResult>"

Examples:
| mineCounterDisplay | displayResult |
|          10        |       9       |
|           9        |       8       |
|           3        |       2       |
|           1        |       0       |
|           0        |      -1       |
|          -1        |      -2       |


Scenario Outline: Increase mine counter by questionable
Given the mineCounter display shows the following value: "<mineCounterDisplay>"
When the user marks a suspected cell as questionable
Then the cell should be disabled
And the mineCounter display should show the following value: "<displayResult>"

Examples:
| mineCounterDisplay | displayResult |
|           9        |      10       |
|           8        |       9       |
|           1        |       2       |
|           0        |       1       |
|          -1        |       0       |
|          -2        |      -1       |


Scenario Outline: Increase mine counter by clicking on suspected cell
Given the mineCounter display shows the following value: "<mineCounterDisplay>"
When the user clicks on a suspected cell
Then the cell should be disabled
And the mineCounter display should show the following value: "<displayResult>"

Examples:
| mineCounterDisplay | displayResult |
|           9        |      10       |
|           8        |       9       |
|           1        |       2       |
|           0        |       1       |
|          -1        |       0       |
|          -2        |      -1       |


Scenario Outline: Increase mine counter by clicking on questionable cell
Given the mineCounter display shows the following value: "<mineCounterDisplay>"
When the user clicks on a questionable cell
Then the cell should be disabled
And the mineCounter display should show the following value: "<displayResult>"

Examples:
| mineCounterDisplay | displayResult |
|           9        |      10       |
|           8        |       9       |
|           1        |       2       |
|           0        |       1       |
|          -1        |       0       |
|          -2        |      -1       |


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

Scenario: Win the game
Given the user has discovered all the cells except 9 mines + 1 random cell
When the user clicks on the random cell
Then the random cell should be discovered
And the missing mine should automatically be marked as suspected
And the timeCounter should stop increasing
And the mineCounter should show the following value: "0"
And all the cells should be disabled except the "face icon" key

Scenario: Click on a bomb
Given the game has started (need to define it better)
When the user clicks on a bomb
Then all the non-marked as suspected mines should be discovered
And the timeCounter should stop increasing
And all the cells should be disabled except the "face icon" key

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

Scenario: Click on an empty cell
Given there's an empty cell
When the user clicks on it
Then the cell should be discovered
And the cell should be disabled
And also all the adjacent cells that are also empty should be discovered and disabled
And also all the cells that sourround all those empty cells should be discovered and disabled

Scenario: Click on a non-empty cell
Given there's an undiscovered non-empty cell
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