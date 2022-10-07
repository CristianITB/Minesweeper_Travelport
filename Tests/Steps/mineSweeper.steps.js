/* eslint-disable no-undef */
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const url = 'http://127.0.0.1:5500/src/HTML/mineSweeper.html';


async function cellClick(cellPosition){
	await page.click(`[data-testid="${cellPosition}"]`, { force: true })
}

async function cellMark(cellPosition){
	await page.click(`[data-testid="${cellPosition}"]`, { button: "right" })
}

//tengo qe tocar aqui abajo (l.35) pq ahora esta puesto como si solo hubiese una linea
async function displayShowValue(displayValue){
	console.log(displayValue + " display")
	var transcripted = []
	for(let i = 0; i < displayValue.length; i++){
		switch(displayValue[i]){
			case "#": transcripted.push("hidden"); break
			case "*": transcripted.push("mine"); break
			case "!": transcripted.push("tagged"); break
			case "0": transcripted.push("empty"); break
			case "1": transcripted.push("1"); break
			case "2": transcripted.push("2"); break
			case "3": transcripted.push("3"); break
			case "4": transcripted.push("4"); break
			case "5": transcripted.push("5"); break
		}
	}
	console.log(transcripted + " transcr")
	for(let j = 1; j <= transcripted.length; j++){
		const cellStatus = await page.locator(`[data-testid="(1, ${j})"]`).getAttribute("data-status");
		expect(cellStatus).toBe(transcripted[j-1])
	}
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
	for(let x = 1; x < 9; x++){
		for(let y = 1; y < 9; y++){
			const cellCoord = "(" + x + ", " + y + ")"
			const cellStatus = await page.locator(`[data-testid="${cellCoord}"]`).getAttribute("data-status");
			expect(cellStatus).toBe("hidden")
		}
	}
})

Given('the user loads the following mock data: {string}', async function (mockData){
	await page.goto(url + "?mockData=" + mockData);
});

When('the user discovers the cell {string}', async (cellCoord) => {
	await cellClick(cellCoord)
})

Then('the cell {string} should show a mine', async (cellCoord) => {
	const cellStatus = await page.locator(`[data-testid="${cellCoord}"]`).getAttribute("data-status");
	expect(cellStatus).toBe("mine")
})

Then('the board display should show the following value:', async (displayValue) => {
	await displayShowValue(displayValue.replaceAll("\n", "-"))
})

Then('the game should be over', async () => {
	const endGameMessage = await page.locator(".subtext").textContent();
	expect(endGameMessage).toBe("You lost the game like you lose everything in life loser.")
})

Then('the cell {string} should be discovered', async (cellCoord) => {
	const cellStatus = await page.locator(`[data-testid="${cellCoord}"]`).getAttribute("data-status");
	expect(cellStatus).toBe("mine")
})

Then('the cell {string} should show the following value: {string}', async(cellCoord, cellValue) => {
	const cellStatus = await page.locator(`[data-testid="${cellCoord}"]`).textContent();
	expect(cellStatus).toBe(cellValue)
})

Then('the user should win the game', async () => {
	const endGameMessage = await page.locator(".subtext").textContent();
	expect(endGameMessage).toBe("You've won the game! Congratulations motherfucker.")
})

Given('the user loads the followig mock data:', async (mockData) => {
	await page.goto(url + "?mockData=" + mockData.replaceAll("\n", "-"));
});

Then('the cell {string} should be empty', async (cellCoord) => {
	const cellStatus = await page.locator(`[data-testid="${cellCoord}"]`).getAttribute("data-status");
	expect(cellStatus).toBe("empty")
})

When('the user tags the cell {string} as suspected', async (cellCoord) => {
	await cellMark(cellCoord)
})

Then('the cell {string} should show the suspected tag', async (cellCoord) => {
	const cellTextContent = await page.locator(`[data-testid="${cellCoord}"]`).textContent();
	expect(cellTextContent).toBe("!")

	const cellStatus = await page.locator(`[data-testid="${cellCoord}"]`).getAttribute("data-status");
	expect(cellStatus).toBe("tagged")
})

When('the user untags the cell {string}', async (cellCoord) => {
	await cellMark(cellCoord)
})

Then("the cell {string} shouldn't show the suspected tag", async (cellCoord) => {
	const cellTextContent = await page.locator(`[data-testid="${cellCoord}"]`).textContent();
	expect(cellTextContent).toBe("")

	const cellStatus = await page.locator(`[data-testid="${cellCoord}"]`).getAttribute("data-status");
	expect(cellStatus).toBe("hidden")
})


/* ---- Specific feature below here ---- */

