export default class LanguageList {

	/**
	 * @param {Language[]} [languages]
	 */
	constructor(languages = []) {
		this._languages = [];

		languages.forEach(language => {
			if (!this._languages.find(l => l.getCode() === language.getCode())) {
				this._languages.push(language);
			}
		});
	}

	/**
	 * @returns {Language[]}
	 */
	getLanguages = () => this._languages;
}