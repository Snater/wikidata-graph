import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import Query from '../../lib/Query';
import React from 'react';
import Select from '@material-ui/core/Select';

const OPTIONS = [
	{value: Query.MODE.FORWARD, label: 'Forward'},
	{value: Query.MODE.REVERSE, label: 'Reverse'},
	{value: Query.MODE.BOTH, label: 'Bidirectional'},
];

export default function ModeSelect({id, onChange, ...rest}) {
	return (
		<FormControl margin="dense">
			<InputLabel htmlFor={id}>Direction</InputLabel>
			<Select inputProps={{id}} onChange={e => onChange(e.target.value)} {...rest}>
				{OPTIONS.map(option =>
					<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
				)}
			</Select>
		</FormControl>
	);
}

ModeSelect.propTypes = {
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
