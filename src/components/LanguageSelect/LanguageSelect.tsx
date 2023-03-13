import React, {useEffect, useState} from 'react';
import Select, {SelectProps} from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import WikidataInterface from '../../lib/WikidataInterface';

export type LanguageSelectProps = {
	id: string
	onChange: (value: string) => void
} & SelectProps

export default function LanguageSelect({id, onChange, ...rest}: LanguageSelectProps) {
	const [languages, setLanguages] = useState([]);

	useEffect(() => {
		WikidataInterface.getLanguages()
			.then(languages => {
				if (languages) {
					setLanguages(languages);
				}
			});
	}, []);

	return (
		<FormControl margin="dense">
			<InputLabel htmlFor={id}>Language</InputLabel>
			<Select inputProps={{id}} onChange={e => onChange(e.target.value as string)} {...rest}>
				{languages.map(language =>
					<MenuItem key={language.code} value={language.code}>
						{language.label}
					</MenuItem>
				)}
			</Select>
		</FormControl>
	);
}