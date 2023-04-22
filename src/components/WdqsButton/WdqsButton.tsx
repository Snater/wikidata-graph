import React, {useCallback} from 'react';
import Button, {ButtonProps} from '@mui/material/Button';
import Query from '../../lib/Query';
import SparqlGenerator from '../../lib/SparqlGenerator';

type WdqsButtonProps = {
	query: Query
} & ButtonProps

export default function WdqsButton({query, ...rest}: WdqsButtonProps): JSX.Element {

	const handleClick = useCallback(() => {
		const baseUrl = 'https://query.wikidata.org';
		window.open(`${baseUrl}/#${encodeURIComponent(SparqlGenerator.generate(query))}`);
	}, [query]);

	return (
		<Button color="primary" onClick={handleClick} variant="contained" {...rest}/>
	);
}