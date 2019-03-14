import * as types from './types';

/**
 * @param {Object} queryProps
 * @return {Object}
 */
export const updateQueryProps = queryProps => ({
	type: types.ACTION_TYPE_UPDATE_QUERY_PROPS,
	queryProps,
});
