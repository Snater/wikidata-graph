'use client'

import {
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	createContext,
	useContext,
	useState
} from 'react';
import {Link, Node} from '@/lib/WikidataInterface/WikidataInterface';
import {EntityId} from 'wikibase-sdk';
import Query from '@/lib/Query';
import React from 'react';

type Result = {
	root: EntityId
	nodes: Node[]
	links: Link[]
}

interface QueryContextType {
	query?: Query
	setQuery: Dispatch<SetStateAction<Query | undefined>>
	result?: Result
	setResult: Dispatch<SetStateAction<Result | undefined>>
}

const QueryContext = createContext<QueryContextType | null>(null);

export function QueryContextProvider({children}: PropsWithChildren) {
	const [query, setQuery] = useState<Query>();
	const [result, setResult] = useState<Result>();

	return (
		<QueryContext.Provider value={{query, setQuery, result, setResult}}>
			{children}
		</QueryContext.Provider>
	);
}

export default function useQueryContext(): QueryContextType {
	const context = useContext(QueryContext);
	if (!context) {
		throw new Error('useQueryContext must be used within a QueryContextProvider');
	}
	return context;
}
