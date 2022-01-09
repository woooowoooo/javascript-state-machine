'use strict';
module.exports = function (target, ...sources) {
	for (let source of sources) {
		for (let key in source) {
			if (source.hasOwnProperty(key)) {
				target[key] = source[key];
			}
		}
	}
	return target;
};