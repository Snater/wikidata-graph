'use client'

import Query, {QueryJSON} from '../../lib/Query';
import {useCallback, useEffect} from 'react';
import {ParsedQuery} from 'query-string';
import PropTypes from 'prop-types';
import Wikidata from '../../lib/WikidataInterface';
import generateSparql from '../../lib/SparqlGenerator';
import queryString from 'query-string';
import useQueryContext from '../App/QueryContext';

export const DEFAULT_QUERY = new Query('Q9682', 'P40', Query.MODE.BOTH, 'en', 5, 0, 'P3373');

function matchesQueryString(query: Query) {
	return queryString.stringify(query.toJSON()) === window.location.search.slice(1);
}

function isNew(query: Query) {
	return !window.history.state?.item || !query.equals(Query.newFromJSON(window.history.state));
}

function isInitial(query: Query) {
	return !window.history.state?.item && query.equals(DEFAULT_QUERY);
}

export default function QueryManager(): null {

	const {query, setQuery, setResult} = useQueryContext();
	const popStateListener = useCallback((event: PopStateEvent) => {
		setQuery(event.state?.item ? Query.newFromJSON(event.state) : DEFAULT_QUERY);
	}, [setQuery]);

	// Set initial query according to query string.
	useEffect(() => {
		if (window.location.search === '') {
			setQuery(DEFAULT_QUERY);
		} else {
			type ParsedQueryAsQuery = ParsedQuery & QueryJSON;
			const parsedQueryString = queryString.parse(window.location.search);
			const queryStringQuery = Query.newFromJSON(parsedQueryString as ParsedQueryAsQuery);
			window.history.replaceState(queryStringQuery.toJSON(), '', `/${window.location.search}`);
			setQuery(queryStringQuery);
		}
	}, [setQuery]);

	// Add navigation history entries.
	useEffect(() => {
		window.addEventListener('popstate', popStateListener);

		if (query && !matchesQueryString(query) && isNew(query) && !isInitial(query)) {
			window.history.pushState(query.toJSON(), '', `/?${queryString.stringify(query.toJSON())}`);
		}

		return () => {
			window.removeEventListener('popstate', popStateListener);
		}
	}, [popStateListener, query]);

	useEffect(() => {
		if (!query) {
			return;
		}

		generateSparql(query.toJSON())
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
