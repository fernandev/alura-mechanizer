const Browser = require('./Browser');
const Utility = require('../Utility');
const Alura = require('./Alura');
const FileHandler = require('../FileHandler');

class CareerCategory {
	constructor(name, careers) {
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

	get folder() {
		return Alura.assetsPath + '/' + Utility.cleanFileName(this.name);
	}

	save() {
		FileHandler.writeJSONObject(this);
	}

	static addToCareerCategoryList(career_category) {
		CareerCategory._list = CareerCategory._list || [];
		if (!Utility.findObjectInObjectList(CareerCategory, career_category, '_name')) {
			CareerCategory._list.push(career_category);
		}
	}

	static async traverseCareersListPage() {
		await Browser.navigateToPage('https://cursos.alura.com.br/careers', false);
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

module.exports = CareerCategory;