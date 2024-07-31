import {Dispatch, ReactNode, SetStateAction, createContext, useContext, useState} from 'react';
import {Link, Node} from '../../lib/WikidataInterface/WikidataInterface';
import Query from '../../lib/Query';
import React from 'react';

interface QueryContextType {
	query?: Query
	setQuery: Dispatch<SetStateAction<Query | undefined>>
	result?: {nodes: Node[], links: Link[]}
	setResult: Dispatch<SetStateAction<{nodes: Node[], links: Link[]} | undefined>>
}

const QueryContext = createContext<QueryContextType | null>(null);

interface QueryContextProviderProps {
	children: ReactNode
}

export function QueryContextProvider({children}: QueryContextProviderProps): JSX.Element {
	const [query, setQuery] = useState<Query | undefined>();
	const [result, setResult] = useState<{nodes: Node[], links: Link[]} | undefined>();

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
