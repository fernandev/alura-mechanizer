const puppeteer = require('puppeteer');

class Browser {
    static get page() {
        return Browser._page;
    }

    static async setupBrowser() {
        Browser._browser = await puppeteer.launch({headless: false});
        Browser._page = await Browser._browser.pages().then(async (page) => await page[0]);
    }
}

module.exports = Browser;