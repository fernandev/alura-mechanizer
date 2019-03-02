const Configuration = require('./classes/Configuration');

class Utility {
	static cleanFileName(string) {
		return string.replace(/[\\\/\:\*\?\"\<\>\|\.]/g, '-');
	}

	static parseContentDuration(string) {
		const trimmedContent = string.trim();
		const parsedContent = trimmedContent.replace(/\D/g, '');
		return Number.parseInt(parsedContent, 10);
	}

	static findObjectInObjectList(objects_list, compared_object, ...comparingAttribute) {
		const [first_attribute, second_attribute] = comparingAttribute;
		if (!Array.isArray(objects_list)) {
			return false;
		}
		if (!objects_list.length) {
			return false;
			}
			return objects_list.filter(object_in_list => {
			if (!second_attribute) {
				return object_in_list[first_attribute] === compared_object[first_attribute];
			} else {
					return object_in_list[first_attribute].some(attribute_in_object_in_list => {
						return attribute_in_object_in_list[second_attribute] === compared_object[second_attribute];
				});
			}
		})[0];
	}

	static findObjectInComplianceWithConfiguration(object_list, object_name) {
		//Must allow multiple conditions.

		/*
			Example: Filter course that has name A
			filter course that is already enrolled.

			If course A is not enrolled, he shouldn't be accepted.

		*/
		let filteredObjectList = [];
		const objectFilters = Configuration.list[object_name].filter;
		if (objectFilters) {
			for (const filterType in objectFilters) {
				const filteredObject = object_list.filter(object => {
					if (Array.isArray(objectFilters[filterType])) {
						return objectFilters[filterType].includes(object['_' + filterType]);
					}
					return objectFilters[filterType] === object['_' + filterType];
				});

				const objectsInList = Utility.findObjectInObjectList(filteredObjectList, filteredObject, filterType);
				if (filteredObject && (!objectsInList || !objectsInList.length)) {
					filteredObjectList.push(filteredObject);
				}
			}
		} else {
			filteredObjectList = object_list;
		}
		return filteredObjectList;
	}

	static sleep(ms) {
		if (!ms || Number.isNaN(ms)) {
			throw new Error("Sleep must be provided with a numeric argument");
		} else {
			return new Promise(resolve => {
				const sleepTimeout = setTimeout(_ => {
					resolve(true);
					clearInterval(sleepTimeout);
				}, ms);
			});
		}
	}
}

module.exports = Utility;