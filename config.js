'use strict';
let mixin = require('./util/mixin');
let camelize = require('./util/camelize');
function Config(options, StateMachine) {
	options = options ?? {};
	this.options = options; // preserving original options can be useful (e.g visualize plugin)
	this.defaults = StateMachine.defaults;
	this.states = [];
	this.transitions = [];
	this.map = {};
	this.lifecycle = this.configureLifecycle();
	this.init = this.configureInitTransition(options.init);
	this.data = this.configureData(options.data);
	this.methods = this.configureMethods(options.methods);
	this.map[this.defaults.wildcard] = {};
	this.configureTransitions(options.transitions ?? []);
	this.plugins = this.configurePlugins(options.plugins, StateMachine.plugin);
}
mixin(Config.prototype, {
	addState: function (name) {
		if (!this.map[name]) {
			this.states.push(name);
			this.addStateLifecycleNames(name);
			this.map[name] = {};
		}
	},
	addStateLifecycleNames: function (name) {
		this.lifecycle.onEnter[name] = camelize.prepended('onEnter', name);
		this.lifecycle.onLeave[name] = camelize.prepended('onLeave', name);
		this.lifecycle.on[name] = camelize.prepended('on', name);
	},
	addTransition: function (name) {
		if (this.transitions.indexOf(name) < 0) {
			this.transitions.push(name);
			this.addTransitionLifecycleNames(name);
		}
	},
	addTransitionLifecycleNames: function (name) {
		this.lifecycle.onBefore[name] = camelize.prepended('onBefore', name);
		this.lifecycle.onAfter[name] = camelize.prepended('onAfter', name);
		this.lifecycle.on[name] = camelize.prepended('on', name);
	},
	mapTransition: function (transition) {
		let name = transition.name;
		let from = transition.from;
		let to = transition.to;
		this.addState(from);
		if (typeof to !== 'function') {
			this.addState(to);
		}
		this.addTransition(name);
		this.map[from][name] = transition;
		return transition;
	},
	configureLifecycle: function () {
		return {
			onBefore: {transition: 'onBeforeTransition'},
			onAfter: {transition: 'onAfterTransition'},
			onEnter: {state: 'onEnterState'},
			onLeave: {state: 'onLeaveState'},
			on: {transition: 'onTransition'}
		};
	},
	configureInitTransition: function (init) {
		if (typeof init === 'string') {
			return this.mapTransition(mixin({}, this.defaults.init, {to: init, active: true}));
		} else if (typeof init === 'object') {
			return this.mapTransition(mixin({}, this.defaults.init, init, {active: true}));
		} else {
			this.addState(this.defaults.init.from);
			return this.defaults.init;
		}
	},
	configureData: function (data) {
		if (typeof data === 'function') {
			return data;
		} else if (typeof data === 'object') {
			return function () {
				return data;
			};
		} else {
			return function () {
				return {};
			};
		}
	},
	configureMethods: function (methods) {
		return methods ?? {};
	},
	configurePlugins: function (plugins, builtin) {
		plugins = plugins ?? [];
		for (let n = 0; n < plugins.length; n++) {
			let plugin = plugins[n];
			if (typeof plugin === 'function') {
				let plugin = plugin();
				plugins[n] = plugin;
			}
			if (plugin.configure) {
				plugin.configure(this);
			}
		}
		return plugins;
	},
	configureTransitions: function (transitions) {
		let wildcard = this.defaults.wildcard;
		for (let transition of transitions) {
			let from = Array.isArray(transition.from) ? transition.from : [transition.from ?? wildcard];
			let to = transition.to ?? wildcard;
			for (let element of from) {
				this.mapTransition({name: transition.name, from: element, to: to});
			}
		}
	},
	transitionFor: function (state, transition) {
		let wildcard = this.defaults.wildcard;
		return this.map[state][transition] ?? this.map[wildcard][transition];
	},
	transitionsFor: function (state) {
		let wildcard = this.defaults.wildcard;
		return Object.keys(this.map[state]).concat(Object.keys(this.map[wildcard]));
	},
	allStates: function () {
		return this.states;
	},
	allTransitions: function () {
		return this.transitions;
	}
});
module.exports = Config;