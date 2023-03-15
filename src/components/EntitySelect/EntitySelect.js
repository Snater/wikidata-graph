import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import FormControl from '@mui/material/FormControl';
import WikidataInterface from '../../lib/WikidataInterface';
import components from './components';
import { useTheme } from "styled-components";

/**
 * @param {string} input
 * @param {string} entityType
 * @return {Promise}
 */
function loadOptions(input, entityType) {
	return WikidataInterface.search(input, entityType)
		.then(response => response.search.map(
			result => Object.create({
				value: result.id,
				label: result.label,
				description: result.description,
			})
		));
}

function EntitySelect({entityId, entityType, label, onChange}) {
	const [value, setValue] = useState(null);
	const [cachedValue, setCachedValue] = useState(null);
	const [placeholder, setPlaceholder] = useState('Start typing to search for an entity');
	const theme = useTheme();

	useEffect(() => {
		if (!entityId || !entityType) {
			return;
		}

		WikidataInterface.search(entityId, entityType)
			.then(response => {
				setValue({
					value: response.search[0].value,
					label: response.search[0].label
				});

				setPlaceholder(response.search[0].label);
			});
	}, [entityId, entityType]);

	useEffect(() => {
		if (value) {
			setCachedValue(value);
		}
	}, [value]);

	const handleChange = selectedOption => {
		setValue({
			value: selectedOption.value,
			label: selectedOption.label,
		});

		setPlaceholder(selectedOption.label);

		onChange && onChange(selectedOption.value);
	};

	const selectStyles = {
		input: base => ({
			...base,
			color: theme.palette.text.primary,
			'& input': {
				font: 'inherit',
			}
		})
	};

	return(
		<FormControl margin="dense">
			<AsyncSelect
				styles={selectStyles}
				components={components}
				loadOptions={value => loadOptions(value, entityType)}
				onChange={handleChange}
				onFocus={() => setValue(null)}
				onBlur={() => setValue(cachedValue)}
				noOptionsMessage={({inputValue}) => inputValue
					? 'No options'
					: 'Start typing to search for entities'
				}
				placeholder={placeholder}
				value={value}
				textFieldProps={{
					label,
					InputLabelProps: {
						shrink: true,
					},
				}}
			/>
		</FormControl>
	);
}

EntitySelect.propTypes = {
	entityId: PropTypes.string,
	entityType: PropTypes.string,
	label: PropTypes.string,
	onChange: PropTypes.func,
}

EntitySelect.defaultProps = {
	label: '',
}

export default EntitySelect;