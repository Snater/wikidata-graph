import React, {useContext, useState} from 'react';

const QueryContext = React.createContext(null);

export function QueryContextProvider({children}) {
	const [query, setQuery] = useState(null);
	const [result, setResult] = useState(null);

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
