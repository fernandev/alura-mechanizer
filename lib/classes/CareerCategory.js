class CareerCategory {
	constructor(category, careers) {
		this._category = category;
		this._careers = careers;
		//TODO: Update JSON
	}

	get category() {
		return this._category;
	}

	set category(value) {
		this._category = value;
		//TODO: Update JSON
	}

	get careers() {
		return this._careers;
	}

	set careers(value) {
		this._careers = value;
		//TODO: Update JSON
	}
}

module.exports = CareerCategory;