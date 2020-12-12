import React, {useEffect, useState} from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Language from './Language';
import LanguageList from './LanguageList';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import WikidataInterface from '../../lib/WikidataInterface';

export default function LanguageSelect({id, onChange, ...rest}) {
	const [languageList, setLanguageList] = useState(new LanguageList());

	useEffect(() => {
		WikidataInterface.getLanguages()
			.then(results => {
				if (results) {
					setLanguageList(new LanguageList(
						results.map(result => new Language(result.code, result.label))
					));
				}
			});
	}, []);

	return (
		<FormControl margin="dense">
			<InputLabel htmlFor={id}>Language</InputLabel>
			<Select inputProps={{id}} onChange={e => onChange(e.target.value)} {...rest}>
				{languageList.getLanguages().map(language =>
					<MenuItem key={language.getCode()} value={language.getCode()}>
						{language.getLabel()}
					</MenuItem>
				)}
			</Select>
		</FormControl>
	);
}

LanguageSelect.propTypes = {
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
