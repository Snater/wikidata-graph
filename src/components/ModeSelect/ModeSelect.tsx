import Select, {SelectProps} from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import {Mode} from '@/lib/Query';
import React from 'react';

const OPTIONS: {value: Mode, label: string}[] = [
	{value: 'Forward', label: 'Forward'},
	{value: 'Reverse', label: 'Reverse'},
	{value: 'Both', label: 'Bidirectional'},
];

export type ModeSelectProps = {
	id: string
	onChange: (mode: Mode) => void
} & Omit<SelectProps, 'onChange'>

export default function ModeSelect({id, onChange, ...rest}: ModeSelectProps) {
	return (
		<FormControl margin="dense">
			<InputLabel htmlFor={id}>Direction</InputLabel>
			<Select
				inputProps={{id}}
				label="Direction"
				onChange={event => onChange(event.target.value as Mode)}
				{...rest}
			>
				{OPTIONS.map(option =>
					<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
				)}
			</Select>
		</FormControl>
	);
}
