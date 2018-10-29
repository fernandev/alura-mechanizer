const Browser = require('./Browser');
const CareerCategory = require('./CareerCategory');
const Career = require('./Career');
const Course = require('./Course');
const Lesson = require('./Lesson');
const Activity = require('./Activity');
const FileHandler = require('../FileHandler');


class Alura {
	static get baseUrl() {
		return 'https://cursos.alura.com.br';
	}

	static get loginUrl() {
		return Alura.baseUrl + '/loginForm';
	}

	static get careersUrl() {
		return Alura.baseUrl + '/careers';
	}

	static get assetsPath() {
		return 'assets/careers';
	}

	static async login() {
		await Browser.navigateToPage(Alura.loginUrl, false);
		const loginInfo = {
			email: '',
			password: ''
		};

		const emailField = await Browser.page.$('#login-email');
		await emailField.focus();
		await Browser.page.keyboard.type(loginInfo.email);

		const passwordField = await Browser.page.$('#password');
		await passwordField.focus();
		await Browser.page.keyboard.type(loginInfo.password);

		const loginButton = await Browser.page.$('form > button[class="btn-login"]');
		await loginButton.click();
		await Browser.page.waitForNavigation({ waitUntil: 'networkidle0' });
	}

	static async traverseAndPopulateEntitiesFromWebsite() {
		let career_category_list = [];
		for (const career_category of await CareerCategory.traverseCareersListPage()) {
			let this_career_category = new CareerCategory(career_category.name, []);
			career_category_list.push(this_career_category);
			for (const career of career_category.careers) {
				let this_career = new Career(career.name, career.link, []);
				this_career_category.careers.push(this_career);

				for (const course_link of await Career.traverseCareerPage(career.link)) {
					const coursePageInformation = await Course.traverseCoursePage(course_link);
					let this_course = new Course(coursePageInformation.name, coursePageInformation.link, coursePageInformation.workload, coursePageInformation.is_enrolled, coursePageInformation.is_concluded, coursePageInformation.attend_link, coursePageInformation.conclude_link, []);
					this_career.courses.push(this_course);

					for (const lesson of await Lesson.traverseLessonsPage(course_link)) {
						let this_lesson = new Lesson(lesson.name, lesson.link, lesson.workload, []);
						this_course.lessons.push(this_lesson);

						for (const activity of await Activity.traverseActivityPage(lesson.link)) {
							const this_activity = new Activity(activity.name, activity.link, activity.category, activity.is_concluded);
							this_lesson.activities.push(this_activity);
							this_activity.save();
						}
						this_lesson.save();
					}
					this_course.save();
				}
				this_career.save();
			}
			this_career_category.save();
		}
		FileHandler.writeJSON(Alura.assetsPath + '/careers.json', career_category_list);
	}

	static traverseAndPopulateEntitiesFromJSON() {
		const listedEntities = FileHandler.readJSON(Alura.assetsPath + '/careers.json');
		for (const career_category of listedEntities) {
			new CareerCategory(career_category._name, career_category._careers);
			for (const career of career_category._careers) {
				new Career(career._name, career._link, career._courses);
				for (const course of career._courses) {
					new Course(course._name, course._link, course._workload, course._is_enrolled, course._is_concluded, course._attend_link, course._conclude_link, course._lessons);
					for (const lesson of course._lessons) {
						new Lesson(lesson._name, lesson._link, lesson._workload, lesson._activities);
						for (const activity of lesson._activities) {
							new Activity(activity._name, activity._link, activity._category, activity._is_concluded);
						}
					}
				}
			}
		}
	}
}

module.exports = Alura;