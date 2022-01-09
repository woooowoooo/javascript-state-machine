class Exception {
	constructor (message, transition, from, to, current) {
		this.message = message;
		this.transition = transition;
		this.from = from;
		this.to = to;
		this.current = current;
	}
}
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
	for (let word of words.slice(1)) {
		result += word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
	}
	return result;
}
function prepend(prepend, label) {
	label = camelize(label);
	return prepend + label[0].toUpperCase() + label.substring(1);
}
function mixin(target, ...sources) {
	for (let source of sources) {
		for (let key in source) {
			if (Object.hasOwn(source, key)) {
				target[key] = source[key];
			}
		}
	}
	return target;
}
function hook(fsm, name, additional) {
	let plugins = fsm.config.plugins;
	let args = [fsm.context];
	if (additional) {
		args = args.concat(additional);
	}
	for (let plugin of plugins) {
		let method = plugin[name];
		if (method) {
			method.apply(plugin, args);
		}
	}
}
module.exports = {Exception, camelize, prepend, mixin, hook};