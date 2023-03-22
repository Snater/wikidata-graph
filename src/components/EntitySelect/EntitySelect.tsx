import {EntityId, EntityType} from 'wikibase-sdk/dist/types/entity';
import React, {useEffect, useState} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {SearchResponse} from 'wikibase-sdk';
import TextField from '@mui/material/TextField';
import WikidataInterface from '../../lib/WikidataInterface';

interface Entity {
	id: EntityId
	label: string
	description?: string
}

function loadOptions(input: string, entityType: EntityType): Promise<Entity[]> {
	return WikidataInterface.search(input, entityType)
		.then((response: SearchResponse) => response.search.map(
			result => Object.create({
				id: result.id,
				label: result.label,
				description: result.description,
			})
		));
}

type EntitySelectProps = {
	entityId: EntityId
	entityType: EntityType
	label?: string
	onChange?: (id: EntityId) => void
}

export default function EntitySelect({
	entityId,
	entityType,
	label = '',
	onChange
}: EntitySelectProps) {
	const [inputValue, setInputValue] = useState('');
	const [value, setValue] = useState<Entity | null>(null);
	const [options, setOptions] = useState<readonly Entity[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (inputValue === '') {
			setOptions(value ? [value] : []);
			return;
		}

		setLoading(true);

		loadOptions(inputValue, entityType)
			.then(options => {
				setOptions(options);
				setLoading(false);
			});

	}, [entityType, inputValue, value]);

	useEffect(() => {
		if (!entityId || !entityType) {
			return;
		}

		WikidataInterface.search(entityId, entityType)
			.then((response: SearchResponse) => {
				setValue({
					// TODO: Remove redundant casting once https://github.com/maxlath/wikibase-sdk/pull/106/files is merged
					id: response.search[0].id as EntityId,
					label: response.search[0].label,
					description: response.search[0].description
				});
			});
	}, [entityId, entityType]);

	useEffect(() => {
		value && onChange && onChange(value.id);
	}, [onChange, value]);

	return(
		<FormControl margin="dense">
			<Autocomplete
				autoComplete
				filterOptions={x => x}
				filterSelectedOptions
				getOptionLabel={option => option.label}
				includeInputInList
				isOptionEqualToValue={(option, value) => option.id === value.id}
				loading={loading}
				noOptionsText="No options"
				onChange={(event, newValue: Entity | null) => {
					setOptions(newValue ? [newValue, ...options] : options);
					setValue(newValue);
				}}
				onInputChange={(event, newInputValue) => {
					setInputValue(newInputValue);
				}}
				options={options}
				value={value}
				renderInput={params => (
					<TextField
						{...params}
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<>
									{loading ? <CircularProgress color="inherit" size={20} /> : null}
									{params.InputProps.endAdornment}
								</>
							),
						}}
						fullWidth
						label={label}
					/>
				)}
				renderOption={(props, option) => {
					return (
						<ListItem {...props} key={option.id}>
							<ListItemText
								primary={option.label}
								secondary={option.description}
							/>
						</ListItem>
					)
				}}
				/>
		</FormControl>
	);
}