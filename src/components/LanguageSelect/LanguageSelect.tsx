'use client'

import React, {useEffect, useState} from 'react';
import Select, {SelectProps} from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Wikidata from '../../lib/WikidataInterface';

export type LanguageSelectProps = {
	id: string
	onChange: (value: string) => void
} & SelectProps

export default function LanguageSelect({id, onChange, ...rest}: LanguageSelectProps): JSX.Element {
	const [languages, setLanguages] = useState([]);

	useEffect(() => {
		Wikidata.getLanguages()
			.then(languages => {
				if (languages) {
					setLanguages(languages);
				}
			});
	}, []);

	return (
		<FormControl margin="dense">
			<InputLabel htmlFor={id}>Language</InputLabel>
			<Select
				disabled={languages.length === 0}
				inputProps={{id}}
				label="Language"
				onChange={event => onChange(event.target.value as string)}
				{...rest}
			>
				{languages.map(language =>
					<MenuItem key={language.code} value={language.code}>
						{language.label}
					</MenuItem>
				)}
			</Select>
		</FormControl>
	);
}
