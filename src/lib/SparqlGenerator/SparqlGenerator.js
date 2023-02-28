import * as clause from './templates/clause'
import ejs from 'ejs';
import select from './templates/select';
import Query from '../Query';

class SparqlGenerator {

	/**
	 * @param {Query} query
	 * @return {string}
	 */
	static generate(query) {
		return ejs.render(select, {
			useGAS: this._useGAS(query.getLimit(), query.getIterations()),
			sizeProperty: query.getSizeProperty(),
			clause: this._generateClause(query),
			property: query.getProperty(),
			language: query.getLanguage(),
		});
	}

	/**
	 * @param {Query} query
	 * @return {string}
	 */
	static _generateClause(query) {
		if (query.getMode() === Query.MODE.BOTH) {
			const forwardQuery = Query.newFromJSON(query.toJSON());
			forwardQuery.setMode(Query.MODE.FORWARD);
			const reverseQuery = Query.newFromJSON(query.toJSON());
			reverseQuery.setMode(Query.MODE.REVERSE);

			return ejs.render(clause.both, {
				clauses: {
					forward: this._generateClause(forwardQuery),
					reverse: this._generateClause(reverseQuery),
				}
			});
		}

		if (this._useGAS(query.getLimit(), query.getIterations())) {
			return ejs.render(clause.gas, {
				item: query.getItem(),
				mode: query.getMode(),
				iterations: query.getIterations(),
				limit: query.getLimit(),
				property: query.getProperty(),
			});
		}

		if (query.getMode() !== Query.MODE.FORWARD && query.getMode() !== Query.MODE.REVERSE) {
			throw new Error('GAS can be used on forward and reverse traversing only.');
		}

		return ejs.render(
			query.getMode() === Query.MODE.FORWARD ? clause.forward : clause.reverse,
			{
				item: query.getItem(),
				property: query.getProperty(),
			}
		);
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
}

export default SparqlGenerator;