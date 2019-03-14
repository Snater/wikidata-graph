import * as types from './types';

/**
 * @param {Object|null} state
 * @param {string} action
 * @return {Object|null}
 */
function data(state = null, action) {
	switch(action.type) {
		case types.ACTION_TYPE_SET_DATA:
			return {...action.data};
		default:
			return state;
	}
}

export default data;
