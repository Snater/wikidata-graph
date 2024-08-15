'use client'

import Select, {SelectProps} from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Query from '../../lib/Query';
import React from 'react';

const OPTIONS = [
	{value: Query.MODE.FORWARD, label: 'Forward'},
	{value: Query.MODE.REVERSE, label: 'Reverse'},
	{value: Query.MODE.BOTH, label: 'Bidirectional'},
];

export type ModeSelectProps = {
	id: string
	onChange: (mode: string) => void
} & SelectProps

export default function ModeSelect({id, onChange, ...rest}: ModeSelectProps): JSX.Element {
	return (
		<FormControl margin="dense">
			<InputLabel htmlFor={id}>Direction</InputLabel>
			<Select
				inputProps={{id}}
				label="Direction"
				onChange={event => onChange(event.target.value as string)}
				{...rest}
			>
				{OPTIONS.map(option =>
					<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
				)}
			</Select>
		</FormControl>
	);
}
