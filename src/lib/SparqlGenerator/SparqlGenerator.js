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
			useGAS: this._useGAS(query.limit, query.iterations),
			sizeProperty: query.sizeProperty,
			clause: this._generateClause(query),
			property: query.property,
			language: query.language,
		});
	}

	/**
	 * @param {Query} query
	 * @return {string}
	 */
	static _generateClause(query) {
		if (query.mode === Query.MODE.BOTH) {
			const forwardQuery = Query.newFromJSON(query.toJSON());
			forwardQuery.mode = Query.MODE.FORWARD;
			const reverseQuery = Query.newFromJSON(query.toJSON());
			reverseQuery.mode = Query.MODE.REVERSE;

			return ejs.render(clause.both, {
				clauses: {
					forward: this._generateClause(forwardQuery),
					reverse: this._generateClause(reverseQuery),
				}
			});
		}

		if (this._useGAS(query.limit, query.iterations)) {
			return ejs.render(clause.gas, {
				item: query.item,
				mode: query.mode,
				iterations: query.iterations,
				limit: query.limit,
				property: query.property,
			});
		}

		if (query.mode !== Query.MODE.FORWARD && query.mode !== Query.MODE.REVERSE) {
			throw new Error('GAS can be used on forward and reverse traversing only.');
		}

		return ejs.render(
			query.mode === Query.MODE.FORWARD ? clause.forward : clause.reverse,
			{
				item: query.item,
				property: query.property,
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