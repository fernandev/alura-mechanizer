const fs = require('fs');
const Utility = require('./Utility');

class FileHandler {
	static writeJSONObject(object) {
		FileHandler.writeJSON(object.folder + '/' + Utility.cleanFileName(object.name) + '.json', object);
	}

	static writeJSON(path, content) {
		FileHandler.writeFilePath(path);
		fs.writeFileSync(path, JSON.stringify(content, null, '\t'));
	}

	static readJSON(path, notFoundMessage) {
		if (!fs.existsSync(path)) {
			throw new Error(notFoundMessage);
		}
		return JSON.parse(fs.readFileSync(path));
	}

	static writeFilePath(path) {
		for (const folder of FileHandler.findFolderStructure(path)) {
			if (!fs.existsSync(folder)) {
				fs.mkdirSync(folder);
			}
		}
	}

	static findFolderStructure(path) {
		let pathsList = [];
		for (const index in path.split('/')) {
			let regExp = new RegExp(`^(.*?\/){${Number.parseInt(index, 10) + 1}}`);
			let matches = regExp.exec(path);
			if (matches)  pathsList.push(matches[0]);
		}
		return pathsList;
	}
}

module.exports = FileHandler;