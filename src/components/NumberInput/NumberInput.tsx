import TextField, {TextFieldProps} from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import React from 'react';

export type NumberInputProps = {
	onChange?: (number: number) => void
} & TextFieldProps;

export default function NumberInput({onChange, ...rest}: NumberInputProps): JSX.Element {
	return (
		<FormControl margin="dense">
			<TextField
				inputProps={{min: 0}}
				onChange={event => onChange && onChange(parseInt(event.target.value))}
				type="number"
				{...typeof rest.label !== 'string' ? {} : {id: rest.label.toLowerCase().replace(' ', '-')}}
				{...rest}
			/>
		</FormControl>
	)
}