/* eslint-disable no-undef */
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const url = 'http://127.0.0.1:5500/src/HTML/mineSweeper.html';


Given('a user opens the app', async () => {
	await page.goto(url);
});

Given('the user loads the following mock data: {string}', async function (mockData) {
	await page.goto(url + "?mockData=" + mockData);
});
