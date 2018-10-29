class Utility {
	static cleanFileName(string) {
		return string.replace(/[\\\/\:\*\?\"\<\>\|\.]/g, '-');
	}

	static parseContentDuration(string) {
		const trimmedContent = string.trim();
		const parsedContent = trimmedContent.replace(/\D/g, '');
		return Number.parseInt(parsedContent, 10);
	}

	static findObjectInObjectList(object, compared_object, ...comparingAttribute) {
		const [first_attribute, second_attribute] = comparingAttribute;
		if (!Array.isArray(object._list)) {
			return false;
		}
		if (!object._list.length) {
			return false;
			}
			return object._list.filter(object_in_list => {
			if (!second_attribute) {
				return object_in_list[first_attribute] === compared_object[first_attribute];
			} else {
					return object_in_list[first_attribute].some(attribute_in_object_in_list => {
						return attribute_in_object_in_list[second_attribute] === compared_object[second_attribute];
				});
			}
		})[0];
	}
}

module.exports = Utility;