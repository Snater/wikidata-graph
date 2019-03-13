import { combineReducers } from 'redux';
import { ACTIONS } from './actions';

/**
 * @param {Object|null} state
 * @param {string} action
 * @return {Object|null}
 */
function data(state = null, action) {
	switch(action.type) {
		case ACTIONS.SET_DATA:
			return {...action.data};
		default:
			return state;
	}
}

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
		case ACTIONS.UPDATE_QUERY_PROPS:
			return Object.assign({}, state, action.queryProps);
		default:
			return state;
	}
}

export default combineReducers({query, data});
