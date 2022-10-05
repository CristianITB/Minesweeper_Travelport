/* eslint-disable no-undef */
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const url = 'http://127.0.0.1:5500/src/HTML/mineSweeper.html';


async function cellClick(cellPosition){
	await page.click(`[data-testid="${cellPosition}"]`, { force: true })
}

async function showMine(cellPosition){

}

Given('a user opens the app', async () => {
	await page.goto(url);
});

Given('the user loads the following mock data: {string}', async function (mockData){
	console.log("manolo")
	await page.goto(url + "?mockData=" + mockData);
});

Given('the user loads the following mock data:', async (docString) => {
	console.log("antonio")
	await page.goto(url + "?mockData=" + docString);
});

When('the user discovers the cell {string}', async (string) => {
	await cellClick(string)
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

Then('the board display should show the following value: {string}', async (string) => {

})

Then('the cell {string} should show the following value: {string}', async(string, cellValue) => {
	const cellStatus = await page.locator(`[data-testid="${string}"]`).textContent();
	expect(cellStatus).toBe(cellValue)
})

Then('the user should win the game', async () => {
	const endGameMessage = await page.locator(".subtext").textContent();
	expect(endGameMessage).toBe("You've won the game! Congratulations motherfucker.")
})