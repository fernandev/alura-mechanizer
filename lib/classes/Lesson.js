const Browser = require('./Browser');
const Utility = require('../Utility');
const FileHandler = require('../FileHandler');
const Course = require('./Course');

class Lesson {
	constructor(name, link, workload, activities) {
		this._name = name;
		this._link = link;
		this._workload = workload;
		this._activities = activities;
		Lesson.addToLessonList(this);
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

	get workload() {
		return this._workload;
	}

	set workload(value) {
		this._workload = value;
		this.save();
	}

	get activities() {
		return this._activities;
	}

	set activities(value) {
		this._activities = value;
		this.save();
	}

	equals(lesson) {
		return this.constructor === lesson.constructor;
	}

	save() {
		FileHandler.writeJSONObject(this);
	}

	execute() {
		//Nothing to be done here.
	}

	get folder() {
		return Utility.findObjectInObjectList(Course.list, this, '_lessons', '_link').folder + '/' + Utility.cleanFileName(this.name);
	}

	static get list() {
		return Lesson._list;
	}

	static addToLessonList(lesson) {
		Lesson._list = Lesson._list || [];
		if (!Utility.findObjectInObjectList(Lesson.list, lesson, '_link')) {
			Lesson._list.push(lesson);
		}
	}

	static async traverseLessonsPage(course_link) {
		await Browser.navigateToPage(course_link);
		return await Browser.page.evaluate(async () => {
			let lessonsList = [];
			const lessonsElementsList = document.querySelectorAll('ul[class="courseSectionList"] li a[class="courseSectionList-section"]');

			for (const [index, element] of lessonsElementsList.entries()) {
				const lessonNumber = (index + 1).toString().padStart('2', '0');
				const lessonDurationElement = element.querySelector('div[class="courseSectionList-details"] span[class$="videoDuration"]');
				let lessonDuration;
				if (lessonDurationElement) {
					lessonDuration = await window.parseContentDuration(lessonDurationElement.textContent);
				} else {
					lessonDuration = undefined;
				}
				lessonsList.push({
					name: lessonNumber + ' - ' + element.querySelector('p[class="courseSectionList-sectionTitle"]').textContent.trim(),
					link: element.href,
					workload: lessonDuration
				});
			}
			return lessonsList;
		});
	}
}

module.exports = Lesson;