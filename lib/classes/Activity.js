const Browser = require('./Browser');
const Utility = require('../Utility');
const FileHandler = require('../FileHandler');
const Lesson = require('./Lesson');

class Activity {
	constructor(name, link, category, is_concluded) {
		this._name = name;
		this._link = link;
		this._category = category;
		this._is_concluded = is_concluded;
		Activity.addToActivityList(this);
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

	get category() {
		return this._category;
	}

	set category(value) {
		this._category = value;
		this.save();
	}

	get is_concluded() {
		return this._is_concluded;
	}

	set is_concluded(value) {
		this._is_concluded = value;
		this.save();
	}

	save() {
		FileHandler.writeJSONObject(this);
	}

	get folder() {
		return Utility.findObjectInObjectList(Lesson, this, '_activities', '_link').folder + '/' + Utility.cleanFileName(this.name);
	}

	static addToActivityList(activity) {
		Activity._list = Activity._list || [];
		if (!Utility.findObjectInObjectList(Activity, activity, '_link')) {
			Activity._list.push(activity);
		}
	}

	static async traverseActivityPage(lesson_link) {
		await Browser.navigateToPage(lesson_link, true);
		return await Browser.page.evaluate(_ => {
			let activities_list = [];
			document.querySelectorAll('ul[class="task-menu-nav-list"] li[class^="task-menu-nav-item"] a').forEach((element, index) => {
				const activityNumber = (index + 1).toString().padStart('2', '0');
				activities_list.push({
					name: activityNumber + ' - ' + element.querySelector('span[class="task-menu-nav-item-text"] span[class="task-menu-nav-item-title"]').textContent.trim(),
					link: element.href,
					category: element.getAttribute('class').replace(/^.*?task-menu-nav-item-link-(.*?)$/, '$1').toLowerCase(),
					is_concluded: element.querySelector('svg[class^="task-menu-nav-item-svg"]').classList.contains('task-menu-nav-item-svg--done')
				});
			});
			return activities_list;
		});
	}
}

module.exports = Activity;