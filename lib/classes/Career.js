const Browser = require('./Browser');

class Career {
	constructor(name, link, courses) {
		this._name = name;
		this._link = link;
		this._courses = courses;
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

	get courses() {
		return this._courses;
	}

	set courses(value) {
		this._courses = value;
		//TODO: Update JSON
	}
}

module.exports = Career;