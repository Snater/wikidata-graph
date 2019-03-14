import { createStore } from 'redux'
import { combineReducers } from 'redux';
import query from './queryProps';
import data from './data';

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

export default createStore(
	combineReducers({query, data}),
	{query: defaultQuery, data: null}
);
