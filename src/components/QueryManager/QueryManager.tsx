'use client'

import Query, {extractQuery, isQuery} from '../../lib/Query';
import {useCallback, useEffect} from 'react';
import generateSparql from '../../lib/SparqlGenerator';
import queryString from 'query-string';
import {runGraphQuery} from '@/lib/graph/service';
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

function getQueryFromUrl() {
	const parsed = queryString.parse(window.location.search, {
		parseNumbers: true,
	});

	return {
		item: parsed.item,
		property: parsed.property,
		mode: parsed.mode,
		language: parsed.language,
		iterations: parsed.iterations,
		limit: parsed.limit,
		sizeProperty: parsed.sizeProperty,
	} as Query;
}

function serializeQuery(query: Query) {
	return `/?${queryString.stringify(query)}`;
}

export default function QueryManager(): null {

	const {query, setQuery, setResult} = useQueryContext();
	const popStateListener = useCallback((event: PopStateEvent) => {
		setQuery(isQuery(event.state) ? extractQuery(event.state) : DEFAULT_QUERY);
	}, [setQuery]);

	// Set initial query according to query string.
	useEffect(() => {
		if (window.location.search === '') {
			setQuery(DEFAULT_QUERY);
			return;
		}

		const queryFromUrl = getQueryFromUrl();

		if (!isQuery(queryFromUrl)) {
			return;
		}

		window.history.replaceState(
			queryFromUrl,
			'',
			`/?${queryString.stringify(queryFromUrl)}`
		);

		setQuery(queryFromUrl);
	}, [setQuery]);

	useEffect(() => {
		window.addEventListener('popstate', popStateListener);

		return () => {
			window.removeEventListener('popstate', popStateListener);
		};
	}, [popStateListener]);

	useEffect(() => {
		if (!query) {
			return;
		}

		const currentUrl = window.location.pathname + window.location.search;
		const nextUrl = serializeQuery(query);

		if (currentUrl !== nextUrl) {
			window.history.pushState(query, '', nextUrl);
		}
	}, [query]);

	useEffect(() => {
		if (!query) {
			return;
		}

		const controller = new AbortController();

		const load = async () => {
			try {
				const sparql = await generateSparql(query);
				const data = await runGraphQuery(sparql, controller.signal);

				if (!data) {
					return;
				}

				setResult({root: query.item, ...data});
			} catch (error) {
				if ((error as DOMException).name !== 'AbortError') {
					console.error(error);
				}
			}
		};

		load();

		return () => {
			controller.abort();
		};
	}, [query, setResult]);

	return null;
}
