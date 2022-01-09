'use strict';
let mixin = require('../util/mixin');
function visualize(fsm, options) {
	return dotify(dotcfg(fsm, options));
}
function dotcfg(fsm, options) {
	options = options || {};
	let config = dotcfg.fetch(fsm);
	let name = options.name;
	let rankdir = dotcfg.rankdir(options.orientation);
	let states = dotcfg.states(config, options);
	let transitions = dotcfg.transitions(config, options);
	let result = { };
	if (name) {
		result.name = name;
	}
	if (rankdir) {
		result.rankdir = rankdir;
	}
	if (states && states.length > 0) {
		result.states = states;
	}
	if (transitions && transitions.length > 0) {
		result.transitions = transitions;
	}
	return result;
}
dotcfg.fetch = function (fsm) {
	return (typeof fsm === 'function') ? fsm.prototype._fsm.config : fsm._fsm.config;
};
dotcfg.rankdir = function (orientation) {
	if (orientation === 'horizontal') {
		return 'LR';
	} else if (orientation === 'vertical') {
		return 'TB';
	}
};
dotcfg.states = function (config, options) {
	let index; let states = config.states;
	if (!options.init) { // if not showing init transition, then slice out the implied init :from state
		index = states.indexOf(config.init.from);
		states = states.slice(0, index).concat(states.slice(index + 1));
	}
	return states;
};
dotcfg.transitions = function (config, options) {
	let n; let max; let transition;
	let init = config.init;
	let transitions = config.options.transitions || []; // easier to visualize using the ORIGINAL transition declarations rather than our run-time mapping
	let output = [];
	if (options.init && init.active) {
		dotcfg.transition(init.name, init.from, init.to, init.dot, config, options, output);
	}
	for (n = 0, max = transitions.length ; n < max ; n++) {
		transition = config.options.transitions[n];
		dotcfg.transition(transition.name, transition.from, transition.to, transition.dot, config, options, output);
	}
	return output;
};
dotcfg.transition = function (name, from, to, dot, config, options, output) {
	let n; let max; let wildcard = config.defaults.wildcard;
	if (Array.isArray(from)) {
		for (n = 0, max = from.length ; n < max ; n++) {
			dotcfg.transition(name, from[n], to, dot, config, options, output);
		}
	} else if (from === wildcard || from === undefined) {
		for (n = 0, max = config.states.length ; n < max ; n++) {
			dotcfg.transition(name, config.states[n], to, dot, config, options, output);
		}
	} else if (to === wildcard || to === undefined) {
		dotcfg.transition(name, from, from, dot, config, options, output);
	} else if (typeof to === 'function') {
		// do nothing, can't display conditional transition
	} else {
		output.push(mixin({}, { from: from, to: to, label: pad(name) }, dot || {}));
	}
};
function pad(name) {
	return " " + name + " ";
}
function quote(name) {
	return "\"" + name + "\"";
}
function dotify(dotcfg) {
	dotcfg = dotcfg || {};
	let name = dotcfg.name || 'fsm';
	let states = dotcfg.states || [];
	let transitions = dotcfg.transitions || [];
	let rankdir = dotcfg.rankdir;
	let output = [];
	let n; let max;
	output.push("digraph " + quote(name) + " {");
	if (rankdir) {
		output.push("  rankdir=" + rankdir + ";");
	}
	for (n = 0, max = states.length ; n < max ; n++) {
		output.push(dotify.state(states[n]));
	}
	for (n = 0, max = transitions.length ; n < max ; n++) {
		output.push(dotify.edge(transitions[n]));
	}
	output.push("}");
	return output.join("\n");
}
dotify.state = function (state) {
	return "  " + quote(state) + ";";
};
dotify.edge = function (edge) {
	return "  " + quote(edge.from) + " -> " + quote(edge.to) + dotify.edge.attr(edge) + ";";
};
dotify.edge.attr = function (edge) {
	let n;
	let max;
	let key;
	let keys = Object.keys(edge).sort();
	let output = [];
	for (n = 0, max = keys.length ; n < max ; n++) {
		key = keys[n];
		if (key !== 'from' && key !== 'to') {
			output.push(key + "=" + quote(edge[key]));
		}
	}
	return output.length > 0 ? " [ " + output.join(" ; ") + " ]" : "";
};
visualize.dotcfg = dotcfg;
visualize.dotify = dotify;
module.exports = visualize;