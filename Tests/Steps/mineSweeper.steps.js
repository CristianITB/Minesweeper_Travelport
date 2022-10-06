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

Given('a user opens the app', async () => {
	await page.goto(url);
});

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