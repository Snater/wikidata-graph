'use client'

import Query, {isEqual} from '@/lib/Query';
import React, {useCallback} from 'react';
import Box from '@mui/material/Box';
import EntitySelect from '../EntitySelect';
import LanguageSelect from '../LanguageSelect';
import ModeSelect from '../ModeSelect';
import NumberInput from '../NumberInput';
import WdqsButton from '../WdqsButton';
import {styled} from '@mui/material';
import useQueryContext from '../App/QueryContext';

const Col2 = styled(Box)({
	display: 'grid',
	gap: '8px',
	gridTemplateColumns: '1fr 1fr',
})

export default function Form() {

	const {query, setQuery} = useQueryContext();

	const handleChange = useCallback((value: Partial<Query>) => {
		if (!query) {
			return;
		}

		const clonedQuery = Object.assign({}, query, value);

		if (!isEqual(clonedQuery, query)) {
			setQuery(clonedQuery as Query);
		}
	}, [query, setQuery]);

	if (!query) {
		return null;
	}

	return (
		<Box component="form" display="flex" flexDirection="column" m={2} width={280}>
			<EntitySelect
				entityType="item"
				entityId={query.item}
				onChange={value => handleChange({item: value})}
				label="Root Item"
			/>
			<EntitySelect
				entityType="property"
				entityId={query.property}
				onChange={value => handleChange({property: value})}
				label="Traversal Property"
			/>
			<Col2>
				<ModeSelect
					id="mode"
					value={query.mode}
					onChange={value => handleChange({mode: value})}
				/>
				<LanguageSelect
					id="language"
					value={query.language}
					onChange={value => handleChange({language: value})}
				/>
			</Col2>
			<Col2>
				<NumberInput
					label="Iterations"
					value={query.iterations}
					onChange={value => handleChange({iterations: value})}
				/>
				<NumberInput
					label="Limit"
					value={query.limit}
					onChange={value => handleChange({limit: value})}
				/>
			</Col2>
			<EntitySelect
				entityType="property"
				entityId={query.sizeProperty}
				onChange={value => handleChange({sizeProperty: value})}
				label="Circle Size Property"
			/>
			<WdqsButton query={query} sx={{mt: 3}}>Run on Wikidata Query Service</WdqsButton>
		</Box>
	);
}
