import {EntityId, EntityType, SearchResponse} from 'wikibase-sdk';
import React, {useEffect, useMemo, useState} from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import {debounce} from '@mui/material/utils';
import {searchEntities} from '@/lib/wikidata/client';

interface Entity {
	id: EntityId
	label: string
	description?: string
}

type EntitySelectProps = {
	entityId?: EntityId
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

	const debouncedSearch = useMemo(() => {
		return debounce(
			async (
				input: string,
				entityType: EntityType,
				onResult: (results: readonly Entity[]) => void
			) => {
				try {
					const response = await searchEntities(input, entityType);

					onResult(response.search.map(result => ({
						id: result.id as EntityId,
						label: result.label,
						description: result.description,
					})));
				} catch (e) {
					onResult([]);
				}
			},
			400
		);
	}, []);

	useEffect(() => {
		let active = true;

		if (inputValue === '') {
			setOptions(value ? [value] : []);
			setLoading(false);
			return;
		}

		setLoading(true);

		debouncedSearch(inputValue, entityType, results => {
			if (!active) {
				return;
			}

			setOptions(results);
			setLoading(false);
		});

		return () => {
			active = false;
		};
	}, [inputValue, entityType, value, debouncedSearch]);

	useEffect(() => {
		if (!entityId) {
			return;
		}

		let active = true;

		setLoading(true);

		(async () => {
			try {
				const response = await searchEntities(entityId, entityType);

				if (!active || !response.search.length) {
					return;
				}

				const first = response.search[0];

				setValue({
					id: first.id as EntityId,
					label: first.label,
					description: first.description,
				});
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		})();

		return () => {
			active = false;
		};
	}, [entityId, entityType]);

	return (
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
				onChange={(_event, newValue) => {
					if (newValue) {
						setValue(newValue);
						onChange?.(newValue.id);
					}
				}}
				onInputChange={(event, newInputValue) => {
					setInputValue(newInputValue);
				}}
				options={options}
				renderInput={params => (
					<TextField
						{...params}
						fullWidth
						label={label}
						slotProps={{
							input: {
								...params.InputProps,
								endAdornment: (
									<>
										{loading ? (
											<CircularProgress color="inherit" size={20} />
										) : null}
										{params.InputProps.endAdornment}
									</>
								),
							},
						}}
					/>
				)}
				renderOption={(props, option) => (
					<ListItem {...props} key={option.id}>
						<ListItemText
							primary={option.label}
							secondary={option.description}
						/>
					</ListItem>
				)}
				value={value}
			/>
		</FormControl>
	);
}
