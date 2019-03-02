const Alura = require('./classes/Alura');
const Browser = require('./classes/Browser');

(async () => {

	await Browser.setupBrowser();
	await Alura.login();
	await Alura.traverseAndPopulateEntitiesFromWebsite(); //Will scan Alura's website for courses.
	//await Alura.traverseAndPopulateEntitiesFromJSON(); //If you already have the careers.json file populated, use this instead of Alura.traverseAndPopulateEntitiesFromWebsite();
	await Alura.executeConfigurations();
})();