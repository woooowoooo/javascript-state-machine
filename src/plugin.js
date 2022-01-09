'use strict';
let mixin = require('./util/mixin');
module.exports = {
	build: function (target, config) {
		let plugins = config.plugins;
		for (let plugin of plugins) {
			if (plugin.methods) {
				mixin(target, plugin.methods);
			}
			if (plugin.properties) {
				Object.defineProperties(target, plugin.properties);
			}
		}
	},
	hook: function (fsm, name, additional) {
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
};