Feature: Minesweeper

Background:
Given a user opens the app

Scenario: Default display screen
Then the display should show a panel with 8x8 cells
And all the cells must be undiscovered
And the mineCounter must be set at 10
And the timeDisplay must be empty

Scenario: Pressing the face icon
Given the game has started (need to define it better)
When the user clicks the "face icon" key
Then the display should show all the cells undiscovered

Scenario: Pressing the face icon bis
Given the game has started (need to define it better)
When the user clicks the "face icon" key
Then the game should be restarted --> replace the 10 mines

Scenario: Flag a cell
Given the user does a right click...
....




Scenario Outline: Pressing non-operators screen buttons
Given the display shows the following value: "<displayNumber>"
When the user presses the "<button>" button
Then the display should show the following value: "<displayResult>"

Examples:
| displayNumber | button | displayResult |
|             1 |      0 |            10 |
|             0 |      1 |             1 |