'use strict';
function camelize(label) {
	if (label.length === 0) {
		return label;
	}
	let words = label.split(/[_-]/);
	// single word with first character already lowercase, return untouched
	if ((words.length === 1) && (words[0][0].toLowerCase() === words[0][0])) {
		return label;
	}
	let result = words[0].toLowerCase();
	for (let n = 1; n < words.length; n++) {
		let word = words[n];
		result += word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
	}
	return result;
}
camelize.prepended = function (prepend, label) {
	label = camelize(label);
	return prepend + label[0].toUpperCase() + label.substring(1);
};
module.exports = camelize;