const Browser = require('./classes/Browser');
const Alura = require('./classes/Alura');


(async () => {
	await Browser.setupBrowser();
	Alura.login();
})();