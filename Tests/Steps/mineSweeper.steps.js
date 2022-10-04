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

Given('the user loads the following mock data: {string}', async function (mockData) {
	await page.goto(url + "?mockData=" + mockData);
});

When('the user discovers the cell {string}', async (string) => {
	await cellClick(string)
})

Then('the cell {string} should show a mine', async (string) =>{
	const cellStatus = await page.locator(`[data-testid="${string}"]`).textContent(); //el que ha de mirar el status, pero no se com pillar-lo
	expect(cellStatus).toBe("mine")
})
