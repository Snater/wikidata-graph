import { createStore } from 'redux'
import reducers from './reducers';

/**
 * @type {Object}
 */
const defaultQuery = {
	item: 'Q9682',
	property: 'P40',
	mode: 'both',
	language: 'en',
	iterations: 5,
	limit: 0,
	sizeProperty: 'P3373',
};

export default createStore(reducers, {query: defaultQuery, data: null});
