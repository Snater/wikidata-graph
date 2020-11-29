import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

export default function NumberInput({onChange, ...rest}) {
	return (
		<FormControl margin="dense">
			<TextField
				inputProps={{min: 0}}
				onChange={e => onChange(parseInt(e.target.value))}
				type="number"
				{...rest}
			/>
		</FormControl>
	)
}

NumberInput.propTypes = {
	onChange: PropTypes.func,
};
