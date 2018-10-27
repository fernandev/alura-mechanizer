class Course {
	constructor (name, link, workload, is_enrolled, is_concluded, attend_link, conclude_link, lessons) {
		this._name = name;
		this._link = link;
		this._workload = workload;
		this._is_enrolled = is_enrolled;
		this._is_concluded = is_concluded;
		this._attend_link = attend_link;
		this._conclude_link = conclude_link;
		this._lessons = lessons;
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

	get workload() {
		return this._workload;
	}

	set workload(value) {
		this._workload = value;
		//TODO: Update JSON
	}

	get is_enrolled() {
		return this._is_enrolled;
	}

	set is_enrolled(value) {
		this._is_enrolled = value;
		//TODO: Update JSON
	}

	get is_concluded() {
		return this._is_concluded;
	}

	set is_concluded(value) {
		this._is_concluded = value;
		//TODO: Update JSON
	}

	get attend_link() {
		return this._attend_link;
	}

	set attend_link(value) {
		this._attend_link = value;
		//TODO: Update JSON
	}

	get conclude_link() {
		return this._conclude_link;
	}

	set conclude_link(value) {
		this._conclude_link = value;
		//TODO: Update JSON
	}

	get lessons() {
		return this._lessons;
	}

	set lessons(value) {
		this._lessons = value;
		//TODO: Update JSON
	}
}

module.exports = Course;