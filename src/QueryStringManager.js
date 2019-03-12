import queryString from 'query-string'

/**
 * @param {Object} object1
 * @param {Object} object2
 * @return {boolean}
 */
function objectValuesMatch(object1, object2) {
	let matches = true;

	Object.keys(object1).forEach(key => {
		if (object1[key] !== object2[key]) {
			matches = false;
		}
	});

	return matches;
}

class QueryStringManager {

	/**
	 * @param {Object} object1
	 * @param {Object} object2
	 * @return {boolean}
	 */
	static haveSameValues(object1, object2) {
		return objectValuesMatch(object1, object2)
			|| objectValuesMatch(object2, object1);
	}

	/**
	 * @param {Object} defaultState
	 *   A default state featuring all fully complete state object, including all
	 *   all keys that may be set on a state object.
	 * @param {Function} onPopState
	 */
	constructor(defaultState, onPopState) {
		this._defaultState = defaultState;

		const currentState = this._parseState(
			window.location.search,
			Object.keys(defaultState)
		);

		if (!QueryStringManager.haveSameValues(this._defaultState, currentState)) {
			onPopState(currentState);
		}

		window.onpopstate = e => {
			onPopState(e.state === null ? this._defaultState : e.state)
		};
	}

	/**
	 * @param {string} query
	 * @param {Object} keys
	 * @return {Object}
	 */
	_parseState(query, keys) {
		const parsedSearch = queryString.parse(query);
		const state = {};

		keys.forEach(key => {
			if (parsedSearch[key]) {
				state[key] = parsedSearch[key];
			}
		});

		return state;
	}

	/**
	 * @param {Object} state
	 */
	updateQueryString(state) {
		if (queryString.stringify(state) !== window.location.search.slice(1)) {
			if (
				QueryStringManager.haveSameValues(state, this._defaultState)
				&& window.location.search !== ''
			) {
				// Do not append query parameters on default query.
				window.history.pushState(state, '', '/');
			} else if (!QueryStringManager.haveSameValues(state, this._defaultState)) {
				window.history.pushState(
					state,
					'',
					`/?${queryString.stringify(state)}`
				);
			}
		}
	}
}

export default QueryStringManager;
