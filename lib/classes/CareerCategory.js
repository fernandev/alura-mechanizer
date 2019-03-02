const Browser = require('./Browser');
const Utility = require('../Utility');
const Alura = require('./Alura');
const FileHandler = require('../FileHandler');
const Configuration = require('./Configuration');

class CareerCategory {
	constructor(name, careers, parent) {
		this._name = name;
		this._careers = careers;
		CareerCategory.addToCareerCategoryList(this);
	}

	get name() {
		return this._name;
	}

	set name(value) {
		this._name = value;
		this.save();
	}

	get careers() {
		return this._careers;
	}

	set careers(value) {
		this._careers = value;
		this.save();
	}

	equals(careerCategory) {
		return this.constructor === careerCategory.constructor;
	}

	save() {
		FileHandler.writeJSONObject(this);
	}

	execute() {
		//Nothing to be done here.
	}

	get folder() {
		return 'assets/careers/' + Utility.cleanFileName(this.name);
	}

	static get list() {
		return CareerCategory._list;
	}

	static addToCareerCategoryList(career_category) {
		if (!Utility.findObjectInObjectList(CareerCategory.list, career_category, '_name')) {
			CareerCategory._list.push(career_category);
		}
	}

	static async traverseCareersListPage() {
		await Browser.navigateToPage(Alura.careersUrl, false);
		return await Browser.page.evaluate(_ => {
			let careerCategoriesList = [];
			let currentCategoryObject;
			document.querySelectorAll('ul[class="careerList"] > li > div[class="container"]').forEach(element => {
				let careerCategoryElement = element.querySelector('h2');
				if (careerCategoryElement) {
					currentCategoryObject = {};
					currentCategoryObject.name = careerCategoryElement.textContent.trim();
				} else {
					currentCategoryObject.careers = [];
					element.querySelectorAll('ul > li').forEach(element => {
						currentCategoryObject.careers.push({
							name: element.getAttribute('data-course-name').trim(),
							link: element.querySelector('a').href.trim(),
						});
					});
					careerCategoriesList.push(currentCategoryObject);
				}
			});
			return careerCategoriesList;
		});
	}

}

CareerCategory._list = [];

module.exports = CareerCategory;