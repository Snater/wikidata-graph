import React, {useCallback} from 'react';
import Button, {ButtonProps} from '@mui/material/Button';
import Query from '../../lib/Query';
import generateSparql from '../../lib/SparqlGenerator';

type WdqsButtonProps = {
	query: Query
} & ButtonProps

export default function WdqsButton({query, ...rest}: WdqsButtonProps) {

	const handleClick = useCallback(() => {
		const baseUrl = 'https://query.wikidata.org';
		generateSparql(query)
			.then(sparql => {
				window.open(`${baseUrl}/#${encodeURIComponent(sparql)}`);
			});
	}, [query]);

	return (
		<Button color="primary" onClick={handleClick} variant="contained" {...rest}/>
	);
}
