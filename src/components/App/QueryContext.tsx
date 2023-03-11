import {Dispatch, ReactNode, SetStateAction, createContext, useContext, useState} from 'react';
import Query from '../../lib/Query';

interface QueryContextType {
	query?: Query
	setQuery: Dispatch<SetStateAction<Query | undefined>>
	result?: object
	setResult: Dispatch<SetStateAction<object | undefined>>
}

const QueryContext = createContext<QueryContextType | null>(null);

interface QueryContextProviderProps {
	children: ReactNode
}

export function QueryContextProvider({children}: QueryContextProviderProps) {
	const [query, setQuery] = useState<Query | undefined>();
	const [result, setResult] = useState<object | undefined>();

	return (
		<QueryContext.Provider value={{query, setQuery, result, setResult}}>
			{children}
		</QueryContext.Provider>
	);
}

export default function useQueryContext() {
	const context = useContext(QueryContext);
	if (!context) {
		throw new Error('useQueryContext must be used within a QueryContextProvider');
	}
	return context;
}