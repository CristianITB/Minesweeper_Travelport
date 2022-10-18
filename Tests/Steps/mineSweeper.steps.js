/* eslint-disable no-undef */
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const url = 'http://127.0.0.1:5500/src/HTML/mineSweeper.html';


async function cellClick(cellPosition){
	await page.click(`[data-testid="${cellPosition}"]`, { force: true })
}

async function cellMark(cellPosition, repeatTimes){
	for(let i = 1; i <= repeatTimes; i++){
		await page.click(`[data-testid="${cellPosition}"]`, { button: "right" })
	}
}

async function displayShowValue(displayValue){
	const splittedDisplayValue = displayValue.split("-")
	var transcripted = []
	for(let i = 0; i < displayValue.length; i++){
		switch(displayValue[i]){
			case "#": transcripted.push("hidden"); break
			case "*": transcripted.push("mine"); break
			case "!": transcripted.push("suspected"); break
			case "0": transcripted.push("empty"); break
			case "1": transcripted.push("1"); break
			case "2": transcripted.push("2"); break
			case "3": transcripted.push("3"); break
			case "4": transcripted.push("4"); break
			case "5": transcripted.push("5"); break
		}
	}
	for(let j = 1; j <= splittedDisplayValue; j++){
		for(let k = 1; j <= transcripted.length; k++){
			const cellStatus = await page.locator(`[data-testid="(${k}, ${j})"]`).getAttribute("data-status");
			expect(cellStatus).toBe(transcripted[j-1])
		}
	}
}

async function getCellStatus(cellCoord, expectedCelStatus){
	const cellStatus = await page.locator(`[data-testid="${cellCoord}"]`).getAttribute("data-status");
	expect(cellStatus).toBe(expectedCelStatus)
}

async function getCellTextContent(cellCoord, expectedTextContent){
	const cellStatus = await page.locator(`[data-testid="${cellCoord}"]`).textContent();
	expect(cellStatus).toBe(expectedTextContent)
}

Given('a user opens the app', async () => {
	await page.goto(url);
});

Then('the display should show an 8x8 cells board', async () => {
	const boardDiv = await page.locator(".board")
	console.log("holaaaaa " + boardDiv)
	const boardDivChildren = boardDiv.childNodes
	expect(boardDivChildren).toBe(64)
//	boardDivChildren.forEach(div => {
//	
//	})
})

Then('all the cells should be covered', async () => {
	for(let x = 1; x < 4; x++){
		for(let y = 1; y < 3; y++){
			const cellCoord = "(" + x + ", " + y + ")"
			await getCellStatus(cellCoord, "hidden")
		}
	}
})

Then('the cell {string} should be disabled', async (cellCoord) => {
	const cellStatus = await page.locator(`[data-testid="${cellCoord}"]`).getAttribute("disabled");
	expect(cellStatus).toBe("true")
})

Given('the user loads the following mock data: {string}', async function (mockData){
	await page.goto(url + "?mockData=" + mockData);
});

When('the user discovers the cell {string}', async (cellCoord) => {
	await cellClick(cellCoord)
})

Then('the cell {string} should show a mine', async (cellCoord) => {
	await getCellStatus(cellCoord, "mine")
})

Then('the board display should show the following value:', async (displayValue) => {
	await displayShowValue(displayValue.replaceAll("\n", "-"))
})

Then('the board display should show the following value: {string}', async (displayValue) => {
	await displayShowValue(displayValue.replaceAll("\n", "-"))
})

Then('the game should be over', async () => {
	const endGameMessage = await page.locator(".subtext").textContent();
	expect(endGameMessage).toBe("You lost the game like you lose everything in life loser.")
})

Then('the cell {string} should be discovered', async (cellCoord) => {
	await getCellStatus(cellCoord, "mine")
})

Then('the cell {string} should show the following value: {string}', async(cellCoord, cellValue) => {
	await getCellTextContent(cellCoord, cellValue)
})

Then('the user should win the game', async () => {
	const endGameMessage = await page.locator(".subtext").textContent();
	expect(endGameMessage).toBe("You've won the game! Congratulations motherfucker.")
})

Given('the user loads the following mock data:', async (mockData) => {
	await page.goto(url + "?mockData=" + mockData.replaceAll("\n", "-"));
});

Then('the cell {string} should be empty', async (cellCoord) => {
	await getCellStatus(cellCoord, "empty")
})

When('the user tags the cell {string} as suspected', async (cellCoord) => {
	await cellMark(cellCoord, 1)
})

Then('the cell {string} should show the suspected tag', async (cellCoord) => {
	await getCellTextContent(cellCoord, "!")
	await getCellStatus(cellCoord, "suspected")
})

When('the user untags the suspected cell {string}', async (cellCoord) => {
	await cellMark(cellCoord, 2)
})

Then("the cell {string} shouldn't show the suspected tag", async (cellCoord) => {
	await getCellTextContent(cellCoord, "")
	await getCellStatus(cellCoord, "hidden")
})

Then('the untagged mines counter should be set at: {string}', async (untaggedMinesCounter) => {
	const displayMineCounter = await page.locator(".subtext").textContent()
	expect(displayMineCounter).toBe("💣 Mines left: " + untaggedMinesCounter)
})


/* ---- Specific feature below here ---- */
Then('the time display should be {string}', async(timeCounter) => {
	const timeDisplay = await page.locator(".timer").textContent()
	expect(timeDisplay).toBe(timeCounter)
})

When('the user tags the cell {string} as questionable', async(cellCoord) => {
	await cellMark(cellCoord, 2)
})

Then('the cell {string} should show the questionable tag', async (cellCoord) => {
	await getCellTextContent(cellCoord, "?")
	await getCellStatus(cellCoord, "questionable")
})

When('the user untags the questionable cell {string}', async (cellCoord) => {
	await cellMark(cellCoord, 1)
})

Then("the cell {string} shouldn't show the questionable tag", async (cellCoord) => {
	await getCellTextContent(cellCoord, "")
	await getCellStatus(cellCoord, "hidden")
})

Given('the untagged mines counter is {string}', async(counter) => {
	const displayMineCounter = await page.locator(".subtext").textContent()
	expect(displayMineCounter).toBe("💣 Mines left: " + counter)
})

When('the user restarts the game', async() => {
	await page.click(".restartButton", { force: true })
})

Then('all the cells should be enabled', async () => {
	for(let x = 1; x < 4; x++){
		for(let y = 1; y < 3; y++){
			const cellCoord = "(" + x + ", " + y + ")"
			const cellStatus = await page.locator(`[data-testid="${cellCoord}"]`).getAttribute("disabled");
			expect(cellStatus).toBe(null)
		}
	}
})
