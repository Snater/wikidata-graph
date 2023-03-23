import {EntityId, EntityType} from 'wikibase-sdk/dist/types/entity';
import React, {useEffect, useMemo, useState} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {SearchResponse} from 'wikibase-sdk';
import TextField from '@mui/material/TextField';
import WikidataInterface from '../../lib/WikidataInterface';
import {debounce} from '@mui/material/utils';

interface Entity {
	id: EntityId
	label: string
	description?: string
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

	const fetch = useMemo(() => debounce(
		(input: string, entityType: EntityType, callback: (results: readonly Entity[]) => void) => {
			WikidataInterface.search(input, entityType)
				.then((response: SearchResponse) => {
					callback(response.search.map(
						result => Object.create({
							id: result.id,
							label: result.label,
							description: result.description,
						})
					));
				});
		},
		400,
	), []);

	useEffect(() => {
		if (inputValue === '') {
			setOptions(value ? [value] : []);
			return;
		}

		setLoading(true);

		fetch(inputValue, entityType, results => {
			setOptions(results);
			setLoading(false);
		})
	}, [entityType, fetch, inputValue, value]);

	useEffect(() => {
		if (!entityId || !entityType) {
			return;
		}

		fetch(entityId, entityType, results => {
			setValue({
				// TODO: Remove redundant casting once https://github.com/maxlath/wikibase-sdk/pull/106/files is merged
				id: results[0].id as EntityId,
				label: results[0].label,
				description: results[0].description
			});
		});
	}, [entityId, entityType, fetch]);

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
							<ListItemText primary={option.label} secondary={option.description}/>
						</ListItem>
					)
				}}
				/>
		</FormControl>
	);
}