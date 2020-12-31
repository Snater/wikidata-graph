export default class Query {

	static MODE = {
		FORWARD: 'Forward',
		REVERSE: 'Reverse',
		BOTH: 'Both',
	};

	/**
	 * @param {Object} json
	 * @returns {Query}
	 */
	static newFromJSON = json => {
		return new Query(
			json.item,
			json.property,
			json.mode,
			json.language,
			parseInt(json.iterations),
			parseInt(json.limit),
			json.sizeProperty,
		)
	}

	/**
	 * @param {string} item
	 * @param {string} property
	 * @param {string} mode
	 * @param {string} language
	 * @param {number} iterations
	 * @param {number} limit
	 * @param {string} sizeProperty
	 */
	constructor(item, property, mode, language, iterations, limit, sizeProperty) {
		this._item = item;
		this._property = property;
		this._mode = mode;
		this._language = language;
		this._iterations = iterations;
		this._limit = limit;
		this._sizeProperty = sizeProperty;
	}

	/**
	 * @returns {string}
	 */
	getItem = () => this._item;

	/**
	 * @param {string} item
	 * @returns {string}
	 */
	setItem = item => this._item = item;

	/**
	 * @returns {string}
	 */
	getProperty = () => this._property;

	/**
	 * @param {string} property
	 * @returns {string}
	 */
	setProperty = property => this._property = property;

	/**
	 * @returns {string}
	 */
	getMode = () => this._mode;

	/**
	 * @param {string} mode
	 * @returns {string}
	 */
	setMode = mode => this._mode = mode;

	/**
	 * @returns {string}
	 */
	getLanguage = () => this._language;

	/**
	 * @param {string} language
	 * @returns {string}
	 */
	setLanguage = language => this._language = language;

	/**
	 * @returns {number}
	 */
	getIterations = () => this._iterations;

	/**
	 * @param {number} iterations
	 * @returns {number}
	 */
	setIterations = iterations => this._iterations = iterations;

	/**
	 * @returns {number}
	 */
	getLimit = () => this._limit;

	/**
	 * @param {number} limit
	 * @returns {number}
	 */
	setLimit = limit => this._limit = limit;

	/**
	 * @returns {string}
	 */
	getSizeProperty = () => this._sizeProperty;

	/**
	 * @param {string} sizeProperty
	 * @returns {string}
	 */
	setSizeProperty = sizeProperty => this._sizeProperty = sizeProperty;

	/**
	 * @param {Query} query
	 * @returns {boolean}
	 */
	equals = query => {
		return query.getItem() === this._item
			&& query.getProperty() === this._property
			&& query.getMode() === this._mode
			&& query.getLanguage() === this._language
			&& query.getIterations() === this._iterations
			&& query.getLimit() === this._limit
			&& query.getSizeProperty() === this._sizeProperty;
	}

	/**
	 * @returns {Object}
	 */
	toJSON = () => {
		return {
			item: this._item,
			property: this._property,
			mode: this._mode,
			language: this._language,
			iterations: this._iterations,
			limit: this._limit,
			sizeProperty: this._sizeProperty,
		};
	}
}

