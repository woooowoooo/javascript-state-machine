# Javascript State Machine
Personal fork of [Jake Gordon's Javascript State Machine](https://github.com/jakesgordon/javascript-state-machine/), a library for finite state machines.

## Changes
- Removed webpack bloat
- Modern (after ES5) JS features
	- Breaks compatibility with ES5!
- Use ES6 modules instead of CommonJS

## `module.js` Build Steps
My pre-built version is at [`module.js`](module.js).

1. Concatenate `util.js`, `config.js`, `jsm.js`, and `app.js`.
2. Remove all imports.
3. Remove all exports other than `StateMachine`.
4. Comment to taste.