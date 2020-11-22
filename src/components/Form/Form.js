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
		const clonedQuery = Query.newFromJSON(query.toJSON());
		clonedQuery[method](value);
		setQuery(clonedQuery);
	}, [query, setQuery]);

	if (query === null) {
		return null;
	}

	return (
		<StyledForm>
			<EntitySelect
				entityType="item"
				entityId={query.getItem()}
				onChange={value => handleChange('setItem', value)}
				label="Root Item"
			/>
			<EntitySelect
				entityType="property"
				entityId={query.getProperty()}
				onChange={value => handleChange('setProperty', value)}
				label="Traversal Property"
			/>
			<StyledCol2>
				<ModeSelect
					id="mode"
					value={query.getMode()}
					onChange={value => handleChange('setMode', value)}
				/>
				<LanguageSelect
					id="language"
					value={query.getLanguage()}
					onChange={value => handleChange('setLanguage', value)}
				/>
			</StyledCol2>
			<StyledCol2>
				<NumberInput
					label="Iterations"
					value={query.getIterations()}
					onChange={value => handleChange('setIterations', parseInt(value))}
				/>
				<NumberInput
					label="Limit"
					value={query.getLimit()}
					onChange={value => handleChange('setLimit', parseInt(value))}
				/>
			</StyledCol2>
			<EntitySelect
				entityType="property"
				entityId={query.getSizeProperty()}
				onChange={value => handleChange('setSizeProperty', value)}
				label="Circle Size Property"
			/>
			<StyledWdqsButton queryProps={query.toJSON()}>Run on Wikidata Query Service</StyledWdqsButton>
		</StyledForm>
	);
}
