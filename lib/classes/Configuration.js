class Configuration {

	static get list() {
		return Configuration._list;
	}
}

Configuration._list = {
	CareerCategory: {
		filter: undefined
		/*
		filter: {
			name?: Array,
			link?: Array,
		}
		*/
	},
	Career : {
		filter: undefined
		/*
		filter: {
			name?: Array,
			link?: Array,
		}
		*/
	},
	Course: {
		filter: undefined,

		/*filter: {
			name?: Array,
			link?: Array,
			is_enrolled?: true,
			is_concluded?: true
		},*/
		enroll_to_courses: true,
		automatically_conclude_courses: true

	},
	Lesson: {
		filter: undefined
		/*
		filter: {
			name?: Array,
			link?: Array,
			is_enrolled?: boolean,
			is_concluded?: boolean
		}
		*/
	},
	Activity: {
		filter: undefined,
		/*
		filter: {
			name?: Array,
			link?: Array
			category?: String
			is_concluded?: boolean
		}
		*/
		video: {
			transcription: {
				download: true
			},
			download: true,
			watch: true
		},
		single_choice: {
			download: true,
			answer: true
		},
		multiple_choice: {
			download: true,
			answer: true
		},
		text_content: {
			download: true
		},
		hq_explanation: {
			download: true
		},
		open_question: {
			answer: true,
			download: true
		}
	}
}
module.exports = Configuration;