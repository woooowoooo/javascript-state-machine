# Javascript State Machine
Personal fork of [Jake Gordon's Javascript State Machine](https://github.com/jakesgordon/javascript-state-machine/), a library for finite state machines.

## What I changed:
- Removed webpack bloat
- Modernization
	- Breaks compatibility with ES5!

## To build module.js:
The pre-built version can be accessed at [module.js](module.js).

1. Concatenate the comments below, LICENSE (commented out), util.js, config.js, jsm.js, and app.js; adding a comment stating the file path before each JS file.
```
"use strict";
/* I DID NOT CREATE THIS LIBRARY.
The original source code is at https://github.com/jakesgordon/javascript-state-machine.
My fork is at https://github.com/woooowoooo/javascript-state-machine.
Written with modern JS features and without webpack. */
```
2. Remove all imports.
3. Remove the utils.js exports, change the rest to regular class definitions, and change the final `StateMachine` export to an ES6-style default export.