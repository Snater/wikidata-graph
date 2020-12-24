import * as clause from './templates/clause'
import ejs from 'ejs';
import select from './templates/select';

class SparqlGenerator {

	/**
	 * @type {Object}
	 */
	static _defaultProps = {
		mode: 'both',
		language: 'en',
		iterations: 5,
		limit: 0,
	};

	/**
	 * @param {Object} data
	 * @return {string}
	 */
	static generate(data = this._defaultProps) {
		this._sanitizeData(data);

		return ejs.render(select, {
			useGAS: this._useGAS(data.limit, data.iterations),
			sizeProperty: data.sizeProperty,
			clause: this._generateClause(data),
			property: data.property,
			language: data.language,
		});
	}

	/**
	 * @param {Object} data
	 * @return {string}
	 */
	static _generateClause(data) {
		if (data.mode === 'both') {
			return ejs.render(clause.both, {
				clauses: {
					forward: this._generateClause({...data, mode: 'forward'}),
					reverse: this._generateClause({...data, mode: 'reverse'}),
				}
			});
		}

		if (this._useGAS(data.limit, data.iterations)) {
			return ejs.render(clause.gas, {
				item: data.item,
				mode: this._capitalize(data.mode),
				iterations: data.iterations,
				limit: data.limit,
				property: data.property,
			});
		}

		if (data.mode !== 'forward' && data.mode !== 'reverse') {
			throw new Error('GAS can be used on forward and reverse traversing only.');
		}

		return ejs.render(data.mode === 'forward' ? clause.forward : clause.reverse, {
			item: data.item,
			property: data.property,
		});
	}

	/**
	 *
	 * @param {Object} data
	 * @return {Object}
	 */
	static _sanitizeData(data) {
		if (!data.item || !data.property) {
			throw new Error('Item and property are required to generate a SPARQL query.')
		}

		data.iterations = parseInt(data.iterations);
		data.limit = parseInt(data.limit);

		return Object.assign({}, this._defaultProps, data);
	}

	/**
	 * Whether to use the Gather Apply Scatter model.
	 * (https://wiki.blazegraph.com/wiki/index.php/RDF_GAS_API)
	 *
	 * @param {number} limit
	 * @param {number} iterations
	 * @return {boolean}
	 */
	static _useGAS(limit, iterations) {
		return limit > 0 || iterations > 0;
	}

	/**
	 * @param {string} string
	 * @return {string}
	 */
	static _capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}

export default SparqlGenerator;