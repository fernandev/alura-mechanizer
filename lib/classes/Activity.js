class Activity {
	constructor(name, link, category, is_concluded) {
		this._name = name;
		this._link = link;
		this._category = category;
		this._is_concluded = is_concluded;
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

	get category() {
		return this._category;
	}

	set category(value) {
		this._category = value;
		//TODO: Update JSON
	}

	get is_concluded() {
		return this._is_concluded;
	}

	set is_concluded(value) {
		this._is_concluded = value;
		//TODO: Update JSON
	}
}

module.exports = Activity;