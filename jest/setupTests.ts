/**
 * Waiting for https://github.com/jsdom/jsdom/issues/3363 to be resolved.
 */
global.structuredClone = (val) => {
	return JSON.parse(JSON.stringify(val));
};
