import * as types from './types';

/**
 * @type {Object}
 */
const defaultState = {
	item: null,
	property: null,
	mode: null,
	language: null,
	iterations: null,
	limit: null,
	sizeProperty: null,
};

/**
 * @param {Object} state
 * @param {string} action
 * @return {Object}
 */
function query(state = defaultState, action) {
	switch (action.type) {
		case types.ACTION_TYPE_UPDATE_QUERY_PROPS:
			return Object.assign({}, state, action.queryProps);
		default:
			return state;
	}
}

export default query;
