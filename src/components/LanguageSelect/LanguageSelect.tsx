import React, {useEffect, useState} from 'react';
import Select, {SelectProps} from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import type {Language} from '@/lib/language/types';
import MenuItem from '@mui/material/MenuItem';
import {getLanguages} from '@/lib/language/service';

export type LanguageSelectProps = {
	id: string
	onChange: (value: string) => void
} & Omit<SelectProps, 'onChange'>

export default function LanguageSelect({id, onChange, ...rest}: LanguageSelectProps) {
	const [languages, setLanguages] = useState<Language[]>([]);

	useEffect(() => {
		getLanguages()
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
