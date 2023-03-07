import React, {useCallback} from 'react';
import EntitySelect from '../EntitySelect';
import LanguageSelect from '../LanguageSelect';
import ModeSelect from '../ModeSelect';
import NumberInput from '../NumberInput';
import useQueryContext from '../App/QueryContext';
import Query from '../../lib/Query';
import {StyledCol2, StyledForm, StyledWdqsButton} from './Form.styles';

export default function Form() {

	const {query, setQuery} = useQueryContext();

	const handleChange = useCallback((method, value) => {
		if (!query) {
			return;
		}
		const clonedQuery = Query.newFromJSON(query.toJSON()) as {[index: string]: any};
		clonedQuery[method](value);
		setQuery(clonedQuery as Query);
	}, [query, setQuery]);

	if (!query) {
		return null;
	}

	return (
		<StyledForm>
			<EntitySelect
				entityType="item"
				entityId={query.item}
				onChange={value => handleChange('setItem', value)}
				label="Root Item"
			/>
			<EntitySelect
				entityType="property"
				entityId={query.property}
				onChange={value => handleChange('setProperty', value)}
				label="Traversal Property"
			/>
			<StyledCol2>
				<ModeSelect
					id="mode"
					value={query.mode}
					onChange={value => handleChange('setMode', value)}
				/>
				<LanguageSelect
					id="language"
					value={query.language}
					onChange={value => handleChange('setLanguage', value)}
				/>
			</StyledCol2>
			<StyledCol2>
				<NumberInput
					label="Iterations"
					value={query.iterations}
					onChange={value => handleChange('setIterations', value)}
				/>
				<NumberInput
					label="Limit"
					value={query.limit}
					onChange={value => handleChange('setLimit', value)}
				/>
			</StyledCol2>
			<EntitySelect
				entityType="property"
				entityId={query.sizeProperty}
				onChange={value => handleChange('setSizeProperty', value)}
				label="Circle Size Property"
			/>
			<StyledWdqsButton query={query}>Run on Wikidata Query Service</StyledWdqsButton>
		</StyledForm>
	);
}