const Browser = require('./Browser');
const Alura = require('./Alura');
const Utility = require('../Utility');
const FileHandler = require('../FileHandler');
const Career = require('./Career');
const Configuration = require('./Configuration');

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
		Course.addToCourseList(this);
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

	get is_enrolled() {
		return this._is_enrolled;
	}

	set is_enrolled(value) {
		this._is_enrolled = value;
		this.save();
	}

	get is_concluded() {
		return this._is_concluded;
	}

	set is_concluded(value) {
		this._is_concluded = value;
		this.save();
	}

	get attend_link() {
		return this._attend_link;
	}

	get conclude_link() {
		return this._conclude_link;
	}

	get lessons() {
		return this._lessons;
	}

	set lessons(value) {
		this._lessons = value;
		this.save();
	}

	equals(course) {
		return this.constructor === course.constructor;
	}

	save() {
		FileHandler.writeJSONObject(this);
	}

	async execute() {
		if (Configuration._list.Course.enroll_to_courses && !this._is_enrolled) {
			await Browser.navigateToPage(this._attend_link, true);
		}
	}

	get folder() {
		return Utility.findObjectInObjectList(Career.list, this, '_courses', '_link').folder + '/' + Utility.cleanFileName(this.name);
	}

	async verifyCompletion() {
		await Browser.navigateToPage(this.link, true);
		if (Browser.page.url() !== this.link) {
			await this.evaluateCourse();
		} else {
			const everyLessonCompleted = await Browser.page.evaluate(_ => {
				return Array.from(document.querySelectorAll('ul.courseSectionList li')).every(lesson => {
					const progress = lesson.querySelector('a.courseSectionList-section div.courseSectionList-details aside.courseSectionList-sectionProgress');
					if (!progress)  return false;

					const progressText = progress.innerText;
					if (progressText.includes('/')) {
						const currentAndGoalProgress = progressText.split('/');
						return currentAndGoalProgress.every(value => {
							return value >= currentAndGoalProgress[1];
						});
					}
				});
			});

			if (everyLessonCompleted && (Configuration.list.Course && Configuration.list.Course.automatically_conclude_courses)) {
				this.evaluateCourse();
				Course.addToCompletedCourseList(this);
			}
		}
	}

	async evaluateCourse() {
		await Browser.navigateToPage(this.conclude_link, true);
		await Browser.page.evaluate(_ => {
			const evaluationForm = document.querySelector('form.evaluation-form');
			if (evaluationForm) {
				const scaleList = Array.from(evaluationForm.querySelectorAll('div.evaluation-form-rate fieldset label'));
				const randomEvaluation = Math.ceil(Math.random() * (scaleList.length - 1));
				scaleList[randomEvaluation].click();
				evaluationForm.submit();
			}
		});
	}

	static get list() {
		return Course._list;
	}

	static addToCourseList(course) {
		Course._list = Course._list || [];
		if (!Utility.findObjectInObjectList(Course.list, course, '_link')) {
			Course._list.push(course);
		}
	}

	static async traverseCoursePage(course_link) {
		await Browser.navigateToPage(course_link, false);
		return await Browser.page.evaluate(_ => {
			let courseInformation = {
				'name': document.querySelector('.course-header-banner-title').textContent.trim(),
				'link': document.location.href,
				'workload': undefined,
				'is_enrolled': false,
				'is_concluded': false,
				'attend_link': undefined,
				'conclude_link': undefined,
				'certificate_link': undefined
			};

			document.querySelectorAll('div[class="container"] div[class="course-headline-info-item"]').forEach(element => {
				const infoDescription = element.querySelector('h2[class="course-headline-info-item-description"]').textContent.trim();
				if (infoDescription.toLowerCase() !== 'carga horária')  return;

				const workload = element.querySelector('h3[class="course-headline-info-item-info"]').textContent.trim();
				courseInformation.workload = workload;
			});
			document.querySelectorAll('div[class="course-header-headline-actions"] div[class="container"] a[class*="course-header-button"]').forEach(element => {
				const element_href = element.href;
				const element_classes = element.classList;

				if (element_classes.contains('startContinue-button')) {
					courseInformation.is_enrolled = element_href.includes('continue');
					courseInformation.attend_link = element_href;
				} else if (element_classes.contains('finish-button')) {
					courseInformation.conclude_link = element_href;
				} else if (element_classes.contains('certificate-button')) {
					courseInformation.is_concluded = true;
					courseInformation.certificate_link = element_href;
				}
			});
			return courseInformation;
		});
	}

	static addToCompletedCourseList({name}) {
		const completedCourses = FileHandler.readJSON('assets/careers/completed_courses.json', 'JSON including the completed courses list wasn\'t found!');
		const updatedCompletedCourses = completedCourses.concat(name);
		FileHandler.writeJSON('assets/careers/completed_courses.json', updatedCompletedCourses);
	}

	static verifyCompletedCoursesList() {

		/*

		*/
	}
}

module.exports = Course;