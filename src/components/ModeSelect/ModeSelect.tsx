import Select, {SelectProps} from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
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

export default function ModeSelect({id, onChange, ...rest}: ModeSelectProps) {
	return (
		<FormControl margin="dense">
			<InputLabel htmlFor={id}>Direction</InputLabel>
			<Select inputProps={{id}} onChange={e => onChange(e.target.value as string)} {...rest}>
				{OPTIONS.map(option =>
					<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
				)}
			</Select>
		</FormControl>
	);
}