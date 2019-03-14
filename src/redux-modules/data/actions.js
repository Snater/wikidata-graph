import * as types from './types';

/**
 * @param {Object} data
 * @return {Object}
 */
export const setData = data => ({
	type: types.ACTION_TYPE_SET_DATA,
	data,
});
