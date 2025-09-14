import {type AutocompleteRenderInputParams} from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import TextField from '@mui/material/TextField';

type EntitySelectInputProps = {
	label: string
	loading: boolean
	params: AutocompleteRenderInputParams
}

export default function EntitySelectInput({
	label,
	loading = false,
	params
}: EntitySelectInputProps) {
	return (
		<TextField
			{...params}
			fullWidth
			label={label}
			slotProps={{
				input: {
					...params.InputProps,
					endAdornment: (
						<>
							{loading
								? <CircularProgress color="inherit" size={20} />
								: null
							}
							{params.InputProps.endAdornment}
						</>
					),
				},
			}}
		/>
	);
}
