const Browser = require('./Browser');
const Utility = require('../Utility');
const FileHandler = require('../FileHandler');
const CareerCategory = require('./CareerCategory');
const Configuration = require('./Configuration');

class Career {
	constructor(name, link, courses) {
		this._name = name;
		this._link = link;
		this._courses = courses;
		Career.addToCareerList(this);
	}

	get name() {
		return this._name;
	}

	set name(value) {
		this._name = value;
		this.save();
	}

	get link() {
		return this._link;
	}

	set link(value) {
		this._link = value;
		this.save();
	}

	get courses() {
		return this._courses;
	}

	set courses(value) {
		this._courses = value;
		this.save();
	}

	equals(career) {
		return this.constructor === career.constructor;
	}

	save() {
		FileHandler.writeJSONObject(this);
	}

	execute() {
		//Nothing to be done here.
	}

	get folder() {
		return Utility.findObjectInObjectList(CareerCategory.list, this, '_careers', '_link').folder + '/' + Utility.cleanFileName(this.name);
	}

	static get list() {
		return Career._list;
	}

	static addToCareerList(career) {
		Career._list = Career._list || [];
		if (!Utility.findObjectInObjectList(Career.list, career, '_link')) {
			Career._list.push(career);
		}
	}

	static async traverseCareerPage(career_link) {
		await Browser.navigateToPage(career_link, false);
		return await Browser.page.evaluate(_ => {
			let coursesLinksList = [];
			document.querySelectorAll('ul > li[class^="career"] > a').forEach(element => {
				coursesLinksList.push(element.href.trim());
			});
			return coursesLinksList;
		});
		/*
		await Browser.navigateToPage(career_link, false);
		const pageResponse = await Browser.page.evaluate(_ => {
			var timeout = 2000;
			return Promise.all([new Promise(resolve => {
				const careerElementInterval = setInterval(_ => {
					const careerList = Array.from(document.querySelectorAll('ul > li[class^="career"] > a'));
					if (careerList.length) {
						resolve(careerList.map(element => element.href.trim()));
						clearInterval(careerElementInterval);
					}
					if (timeout <= 0) {
						resolve(false);
						clearInterval(careerElementInterval);
					}
				}, 50);
			})]);
		});
		return pageResponse;
		*/
	}
}

module.exports = Career;