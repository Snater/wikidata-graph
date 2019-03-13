/**
 * @type {Object}
 */
export const ACTIONS = {
	SET_DATA: 'SET_DATA',
	UPDATE_QUERY_PROPS: 'UPDATE_QUERY_PROPS',
};

/**
 * @param {Object} data
 * @return {Object}
 */
export const setData = data => ({
	type: ACTIONS.SET_DATA,
	data,
});

/**
 * @param {Object} queryProps
 * @return {Object}
 */
export const updateQueryProps = queryProps => ({
	type: ACTIONS.UPDATE_QUERY_PROPS,
	queryProps,
});
