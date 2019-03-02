const puppeteer = require('puppeteer');
const Utility = require('../Utility');

class Browser {
	static get page() {
		return Browser._page;
	}

	static async setupBrowser() {
		Browser._browser = await puppeteer.launch({headless: false});
		Browser._page = await Browser._browser.pages().then(async (page) => await page[0]);
		Browser._page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36');
		await Browser.page.exposeFunction('parseContentDuration', Utility.parseContentDuration);
	}

	static async navigateToPage(url, waitUntilNetworkIdle) {
		if (Browser._page.url() === url) {
			return;
		}
		await Browser._page.goto(url, waitUntilNetworkIdle? { waitUntil: 'networkidle2' }: {});

	}
}

module.exports = Browser;