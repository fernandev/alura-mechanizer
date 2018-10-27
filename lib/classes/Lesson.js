class Lesson {
	constructor(name, link, activities) {
		this._name = name;
		this._link = link;
		this._activities = activities;
		//TODO: Update JSON
	}

	get name() {
		return this._name;
	}

	set name(value) {
		this._name = value;
		//TODO: Update JSON
	}

	get link() {
		return this._link;
	}

	set link(value) {
		this._link = value;
		//TODO: Update JSON
	}

	get activities() {
		return this._activities;
	}

	set activities(value) {
		this._activities = value;
		//TODO: Update JSON
	}
}

module.exports = Lesson;