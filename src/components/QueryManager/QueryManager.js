import PropTypes from 'prop-types';
import {useCallback, useEffect} from 'react';
import SparqlGenerator from '../../lib/SparqlGenerator';
import Wikidata from '../../lib/WikidataInterface';
import useQueryContext from '../App/QueryContext';
import queryString from 'query-string';
import Query from '../../lib/Query';

export const DEFAULT_QUERY = new Query('Q9682', 'P40', 'both', 'en', 5, 0, 'P3373');

function matchesQueryString(query) {
	return queryString.stringify(query.toJSON()) === window.location.search.slice(1);
}

function isNew(query) {
	return !window.history.state || !query.equals(Query.newFromJSON(window.history.state));
}

function isInitial(query) {
	return !window.history.state && query.equals(DEFAULT_QUERY);
}

export default function QueryManager() {

	const {query, setQuery, setResult} = useQueryContext();
	const popStateListener = useCallback(event => {
		if (event.state !== null) {
			setQuery(Query.newFromJSON(event.state));
		}
	}, [setQuery]);

	// Set initial query according to query string.
	useEffect(() => {
		if (window.location.search === '') {
			setQuery(DEFAULT_QUERY);
		} else {
			const queryStringQuery = Query.newFromJSON(queryString.parse(window.location.search));
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
		if (query === null) {
			return;
		}

		Wikidata.sparqlQuery(SparqlGenerator.generate(query.toJSON())).then(data => {
			if (data) {
				setResult(data);
			}
		})
	}, [query, setResult]);

	return null;
}

QueryManager.propTypes = {
	onDataRetrieved: PropTypes.func,
};
