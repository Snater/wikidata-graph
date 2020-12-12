export default class Language {

	/**
	 * @param {string} code
	 * @param {string} label
	 */
	constructor(code, label) {
		this._code = code;
		this._label = label;
	}

	/**
	 * @returns {string}
	 */
	getCode = () => this._code;

	/**
	 * @returns {string}
	 */
	getLabel = () => this._label;
}