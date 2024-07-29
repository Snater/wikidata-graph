module.exports = (path, options) => options.defaultResolver(
	path,
	(/^(wikibase-sdk)(\/|$)/.test(path)) ? {...options, conditions: ['import']} : options
);
