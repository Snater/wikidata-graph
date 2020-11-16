import React, {useCallback} from 'react';
import EntitySelect from '../EntitySelect';
import LanguageSelect from '../LanguageSelect';
import ModeSelect from '../ModeSelect';
import NumberInput from '../NumberInput';
import WdqsButton from '../WdqsButton';
import styles from './Form.module.css';
import useQueryContext from '../App/QueryContext';
import Query from '../../lib/Query';

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
		<form className={styles.Form}>
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
			<div className={styles.col2}>
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
			</div>
			<div className={styles.col2}>
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
			</div>
			<EntitySelect
				entityType="property"
				entityId={query.getSizeProperty()}
				onChange={value => handleChange('setSizeProperty', value)}
				label="Circle Size Property"
			/>
			<WdqsButton
				className={styles.button}
				queryProps={query.toJSON()}
			>Run on Wikidata Query Service</WdqsButton>
		</form>
	);
}
