import React, {useEffect, useState} from 'react';
import Select, {SelectProps} from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
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
			<Select inputProps={{id}} label="Language" onChange={e => onChange(e.target.value as string)} {...rest}>
				{languages.map(language =>
					<MenuItem key={language.code} value={language.code}>
						{language.label}
					</MenuItem>
				)}
			</Select>
		</FormControl>
	);
}