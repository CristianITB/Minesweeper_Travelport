Feature: Minesweeper

Background:
Given a user opens the app

Scenario: Default display screen
Then the display should show all the cells undiscovered

Scenario Outline: Pressing non-operators screen buttons
Given the display shows the following value: "<displayNumber>"
When the user presses the "<button>" button
Then the display should show the following value: "<displayResult>"

Examples:
| displayNumber | button | displayResult |
|             1 |      0 |            10 |
|             0 |      1 |             1 |


Scenario: Pressing the escape key
Given the display shows the following value: "123"
When the user presses the "Escape" key
Then the display should show the following value: "0"
