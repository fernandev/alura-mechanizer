const Browser = require('./Browser');
const Utility = require('../Utility');
const FileHandler = require('../FileHandler');
const Lesson = require('./Lesson');
const Configuration = require('./Configuration');

class Activity {
	constructor(name, link, category, is_concluded, is_executed) {
		this._name = name;
		this._link = link;
		this._category = category;
		this._is_concluded = is_concluded;
		this._is_executed = is_executed;
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

	get is_executed() {
		return this._is_executed;
	}

	set is_executed(value) {
		this._is_executed = value;
		this.save();
	}

	equals(activity) {
		return this.constructor === activity.constructor;
	}

	save() {
		FileHandler.writeJSONObject(this);
	}

	getFileNameStringPlusExtension(extension) {
		return this.folder + '/' + Utility.cleanFileName(this.name) + '.' + extension;
	}

	async execute() {
		await Browser.navigateToPage(this._link, true);
		console.log('Executing activity ' + this.name + ' ("' + this.link + '")');
		switch (this._category) {
			case "video":
				await this.executeVideoActivity().catch(_=> console.warn(_.message));
				break;
			case "single_choice":
			case "multiple_choice":
				await this.executeQuizActivity().catch(_=> console.warn(_.message));
				break;
			case "text_content":
			case "hq_explanation":
				await this.executeTextActivity().catch(_=> console.warn(_.message));
				break;
			case "open_question":
				await this.executeQuestionActivity().catch(_=> console.warn(_.message));
				break;
			default: throw new Error("Invalid Activity category!");

		}
		this.is_concluded = true;
	}

	async executeQuestionActivity() {
		const questionConfigurations = Configuration.list.Activity[this.category];
		const activityResponse = await Browser.page.evaluate(questionActivityConfigurations => {
			var timeout = 3000;
			return Promise.all([new Promise(resolve => {
				if (questionActivityConfigurations.answer) {
					const answerButtonInterval = setInterval(_ => {
						const answerButton = document.querySelector('button.task-actions-button-answer');
						if (answerButton) {
							answerButton.click();
							resolve(true);
							clearInterval(answerButtonInterval);
						}
						if (timeout <= 0) {
							resolve(false);
							clearInterval(answerButtonInterval);
						}
						timeout -= 50;
					}, 50);
				} else {
					resolve(false);
					clearInterval(answerButtonInterval);
				}
			}), new Promise(resolve => {
				if (questionActivityConfigurations.download) {
					const textsInterval = setInterval(_ => {
						const textElements = Array.from(document.querySelectorAll('div.formattedText'));
						if (textElements.length) {
							resolve(textElements.reduce((ac, cu, index) => {
								if (index === 0) {
									ac += "<h2>Pergunta do Instrutor</h2>\n";
								} else if (index === 1) {
									ac += "<h2>Opinião do Instrutor</h2>\n";
								}
								return ac + cu.innerHTML.trim() + "\n";
							}, ''));
							clearInterval(textsInterval);
						}
						if (timeout <= 0) {
							resolve(false);
							clearInterval(textsInterval);
						}
						timeout -= 50;
					}, 50);
				}
			})]);
		}, questionConfigurations).catch(_ => {
			throw new Error('Failed to execute ' + this.category + ' activity ' + this.name + ' ("' + this.link + '")');
		});
		const [questionAnswered, questionHTML] = activityResponse;

		if (!questionAnswered && questionConfigurations.answer) {
			throw new Error('Failed to answer question activity ' + this.name + ' ("' + this.link + '")');
		}
		if (questionConfigurations.download) {
			if (!questionHTML) {
				throw new Error('Failed to download question activity' + this.name + ' ("' + this.link + '")');
			} else {
				FileHandler.writeHTMLFile(this.getFileNameStringPlusExtension('html'), questionHTML);
			}
		}
	}

	async executeVideoActivity() {
		const activityConfigurations = Configuration.list.Activity[this.category];
		if (activityConfigurations) {
			const activityResponse = await Browser.page.evaluate(videoActivityConfigurations => {
				var timeout = 5000;
				return Promise.all([new Promise(resolve => { //Video watch Promise
					if (videoActivityConfigurations.watch) {
						videoData = document.querySelector("#video-container-data");
						videoInformation = {courseCode: videoData.getAttribute('data-course'), videoTaskId: videoData.getAttribute('data-task-id')};

						HttpRequest = new XMLHttpRequest();
						HttpRequest.open('POST', window.location.href + '/mark-video', true);
						HttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
						HttpRequest.send(Object.keys(videoInformation).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(videoInformation[key])}`).join('&'));
						const playButtonInterval = setInterval(_ => {
							if (HttpRequest.readyState == 4 && HttpRequest.status == 200) {
								clearInterval(playButtonInterval);
								resolve(true);
							}
							if (timeout <= 0) {
								resolve(false);
							}
							timeout -= 50;
						}, 50);
					} else {
						resolve(false);
					}
				}), new Promise(resolve => { //Video download Promise
					if (videoActivityConfigurations.download) {
						const videoInterval = setInterval(_ => {
							const videoTag = document.querySelector('video');
							if (videoTag) {
								resolve(videoTag.getAttribute('src').replace(/^.*?http/, 'http'));
								clearInterval(videoInterval);
							}
							if (timeout <= 0) {
								resolve(false);
								clearInterval(videoInterval);
							}
							timeout -= 50;
						}, 50);
					} else {
						resolve(false);
					}
				}), new Promise(resolve => { //Transcription download Promise
					if (videoActivityConfigurations.transcription && videoActivityConfigurations.transcription.download) {
						const transcriptionInterval = setInterval(_ => {
							const transcriptionTag = document.querySelector('#transcription');
							if (transcriptionTag) {
								resolve(transcriptionTag.innerHTML.trim());
								clearInterval(transcriptionInterval);
							}
							if (timeout <= 0) {
								resolve(false);
								clearInterval(transcriptionInterval);
							}
							timeout -= 50;
						}, 50);
					} else {
						resolve(false);
					}
				})]);
			}, activityConfigurations).catch(_ => {
				throw new Error('Failed to execute ' + this.category + ' activity ' + this.name + ' ("' + this.link + '")');
			});

			const [videoWatched, videoDownloadedURL, videoTranscriptionDownloadedHTML] = activityResponse;
			if (!videoWatched && activityConfigurations.watch) {
				throw new Error('Failed to start video in video activity ' + this.name + ' ("' + this.link + '")');
			}
			if (!videoDownloadedURL && activityConfigurations.download) {
				throw new Error('Failed to download video in video activity ' + this.name + ' ("' + this.link + '")');
			} else if (activityConfigurations.download) {
				await Browser.page.evaluate(_ => {
					return Promise.all([new Promise(resolve => {
						document.querySelector('#task-content').parentNode.removeChild(document.querySelector('#task-content'));
						resolve(true);
					}), new Promise(resolve => {
						const sleepTimeout = setTimeout(_ => {
							resolve(true);
							clearInterval(sleepTimeout);
						}, 10000);
					})]);
				});
				await FileHandler.downloadFile(videoDownloadedURL, this.getFileNameStringPlusExtension(videoDownloadedURL.replace(/.*\./, '')));
			}
			if (!videoTranscriptionDownloadedHTML && (activityConfigurations.transcription && activityConfigurations.transcription.download)) {
				throw new Error('Failed to download video transcription in video activity ' + this.name + ' ("' + this.link + '")');
			} else if (activityConfigurations.transcription && activityConfigurations.transcription.download) {
				FileHandler.writeHTMLFile(this.getFileNameStringPlusExtension('html'), videoTranscriptionDownloadedHTML);
			}
		}
	}

	async executeQuizActivity() {
		const activityConfigurations = Configuration.list.Activity[this.category];
		if (activityConfigurations) {
			const activityResponse = await Browser.page.evaluate(quizActivityConfigurations => {
				var timeout = 2500;
				return Promise.all([new Promise(resolve => { //Quiz answer Promise
					if (quizActivityConfigurations.answer) {
						const questionsListInterval = setInterval(_ => {
							const questionsList = document.querySelectorAll('li.alternativeList-item');
							if (questionsList.length) {
								console.log({questionsList});
								questionsList.forEach(element => {
									if (element.getAttribute('data-correct') === 'true') {
										element.querySelector('label>span').click();
									}
								});
								resolve(true);
								clearInterval(questionsListInterval);
							}
							if (timeout <= 0) {
								resolve(false);
								clearInterval(questionsListInterval);
							}
							timeout -= 50;
						}, 50);
					} else {
						resolve(false);
					}
				}), new Promise(resolve => { //Question download Promise
					if (quizActivityConfigurations.download) {
						const questionsListInterval = setInterval(_ => {
							const questionsList = document.querySelectorAll('li.alternativeList-item');
							if (questionsList.length) {
								questionsList.forEach(element => {
									if (element.getAttribute('data-correct') === 'true') {
										element.setAttribute('style', 'background-color:green;');
									} else {
										element.setAttribute('style', 'background-color:red;');
									}
								});
								const taskContentElement = document.querySelector('#task-content div.container');
								resolve(Array.from(taskContentElement.querySelectorAll('h2.choiceable-title, ul.alternativeList, section.choiceable-opinion')).reduce((ac, cu) => {
									return ac + cu.innerHTML.trim() + "\n";
								}, ''));
								clearInterval(questionsListInterval);
							}
							if (timeout <= 0) {
								resolve(false);
								clearInterval(questionsListInterval);
							}
							timeout -= 50;
						}, 50);
					} else {
						resolve(false);
					}
				})]);
			}, activityConfigurations).catch(_ => {
				throw new Error('Failed to execute ' + this.category + ' activity ' + this.name + ' ("' + this.link + '")');
			});

			const [questionAnswered, questionDownloadedHTML] = activityResponse;

			if (!questionAnswered && activityConfigurations.answer) {
				throw new Error('Failed to answer question activity ' + this.name + ' ("' + this.link + '")');
			}
			if (!questionDownloadedHTML && activityConfigurations.download) {
				throw new Error('Failed to download question activity ' + this.name + ' ("' + this.link + '")');
			} else if (activityConfigurations.download) {
				FileHandler.writeHTMLFile(this.getFileNameStringPlusExtension('html'), questionDownloadedHTML);
			}
			this.is_concluded = true;
		}
	}

	async executeTextActivity() {
		const activityConfigurations = Configuration.list.Activity[this.category];
		if (activityConfigurations) {
			const activityResponse = await Browser.page.evaluate(activityConfigurations => {
				var timeout = 2000;
				return Promise.all([new Promise(resolve => {
					if (activityConfigurations.download) {
						const textElementInterval = setInterval(_ => {
							const textElement = document.querySelector('#task-content div[class="container"] div[class="formattedText"]');
							if (textElement) {
								resolve(textElement.innerHTML.trim());
								clearInterval(textElementInterval);
							}
							if (timeout <= 0) {
								resolve(false);
								clearInterval(textElementInterval);
							}
							timeout -= 50;
						}, 50);
					} else {
						resolve(false);
					}
				})])
			}, activityConfigurations).catch(_ => {
				throw new Error('Failed to execute ' + this.category + ' activity ' + this.name + ' ("' + this.link + '")');
			});

			const [textDownloadedHTML] = activityResponse;

			if (!textDownloadedHTML && activityConfigurations.download) {
				throw new Error('Failed to download text activity ' + this.name + ' ("' + this.link + '")');
			} else if (activityConfigurations.download) {
				FileHandler.writeHTMLFile(this.getFileNameStringPlusExtension('html'), textDownloadedHTML);
			}
		}
		this.is_concluded = true;
	}

	get folder() {
		return Utility.findObjectInObjectList(Lesson.list, this, '_activities', '_link').folder + '/' + Utility.cleanFileName(this.name);
	}

	static get list() {
		return Activity._list;
	}

	static addToActivityList(activity) {
		Activity._list = Activity._list || [];
		if (!Utility.findObjectInObjectList(Activity.list, activity, '_link')) {
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