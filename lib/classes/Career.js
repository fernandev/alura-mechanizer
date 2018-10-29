const Browser = require('./Browser');
const Utility = require('../Utility');
const FileHandler = require('../FileHandler');
const CareerCategory = require('./CareerCategory');

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

	save() {
		FileHandler.writeJSONObject(this);
	}

	get folder() {
		return Utility.findObjectInObjectList(CareerCategory, this, '_careers', '_link').folder + '/' + Utility.cleanFileName(this.name);
	}

	static get careerCategoryFolder() {
		return '/assets/careers';
	}

	static addToCareerList(career) {
		Career._list = Career._list || [];
		if (!Utility.findObjectInObjectList(Career, career, '_link')) {
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

	}
}

module.exports = Career;