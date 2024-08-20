'use client'

import Query, {isEqual, isQuery} from '../../lib/Query';
import {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import Wikidata from '../../lib/WikidataInterface';
import generateSparql from '../../lib/SparqlGenerator';
import queryString from 'query-string';
import useQueryContext from '../App/QueryContext';

export const DEFAULT_QUERY: Query = {
	item: 'Q9682',
	property: 'P40',
	mode: 'Both',
	language: 'en',
	iterations: 5,
	limit: 0,
	sizeProperty: 'P3373',
};

function matchesQueryString(query: Query) {
	return queryString.stringify(query) === window.location.search.slice(1);
}

function isNew(query: Query) {
	return !window.history.state?.item || !isEqual(query, window.history.state);
}

function isInitial(query: Query) {
	return !window.history.state?.item && isEqual(query, DEFAULT_QUERY);
}

export default function QueryManager(): null {

	const {query, setQuery, setResult} = useQueryContext();
	const popStateListener = useCallback((event: PopStateEvent) => {
		setQuery(event.state?.item ? event.state : DEFAULT_QUERY);
	}, [setQuery]);

	// Set initial query according to query string.
	useEffect(() => {
		if (window.location.search === '') {
			setQuery(DEFAULT_QUERY);
		} else {
			const parsedQueryString = queryString.parse(window.location.search, {parseNumbers: true});
			const queryStringQuery = {
				item: parsedQueryString.item,
				property: parsedQueryString.property,
				mode: parsedQueryString.mode,
				language: parsedQueryString.language,
				iterations: parsedQueryString.iterations,
				limit: parsedQueryString.limit,
				sizeProperty: parsedQueryString.sizeProperty,
			}

			if (isQuery(queryStringQuery)) {
				window.history.replaceState(queryStringQuery, '', `/${window.location.search}`);
				setQuery(queryStringQuery);
			}
		}
	}, [setQuery]);

	// Add navigation history entries.
	useEffect(() => {
		window.addEventListener('popstate', popStateListener);

		if (query && !matchesQueryString(query) && isNew(query) && !isInitial(query)) {
			window.history.pushState(query, '', `/?${queryString.stringify(query)}`);
		}

		return () => {
			window.removeEventListener('popstate', popStateListener);
		}
	}, [popStateListener, query]);

	useEffect(() => {
		if (!query) {
			return;
		}

		generateSparql(query)
			.then(sparql => {
				Wikidata.sparqlQuery(sparql).then(data => {
					if (data) {
						setResult(data);
					}
				})
			});
	}, [query, setResult]);

	return null;
}

QueryManager.propTypes = {
	onDataRetrieved: PropTypes.func,
};
