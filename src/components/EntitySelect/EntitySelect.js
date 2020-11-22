import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/lib/Async';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import WikidataInterface from '../../lib/WikidataInterface';
import {
	StyledInput,
	StyledNoOptionsMessage,
	StyledOption,
	StyledPaper,
	StyledPlaceholder,
	StyledSingleValue,
	StyledValueContainer
} from './EntitySelect.styles';
import { useTheme } from "styled-components";

/**
 * @param {Object} props
 * @return {JSX.Element}
 */
function NoOptionsMessage(props) {
	return (
		<StyledNoOptionsMessage color="textSecondary" {...props.innerProps}>
			{props.children}
		</StyledNoOptionsMessage>
	);
}

/**
 * @param {Object} inputRef
 * @param {Object} props
 * @return {JSX.Element}
 */
function inputComponent({inputRef, ...props}) {
	return <StyledInput ref={inputRef} {...props} />;
}

/**
 * @param {Object} props
 * @return {JSX.Element}
 */
function Control(props) {
	return (
		<TextField
			fullWidth
			InputProps={{
				inputComponent,
				inputProps: {
					inputRef: props.innerRef,
					children: props.children,
					...props.innerProps,
				}
			}}
			{...props.selectProps.textFieldProps}
		/>
	);
}

/**
 * @param {Object} props
 * @return {JSX.Element}
 */
function Option(props) {
	return (
		<StyledOption
			buttonRef={props.innerRef}
			selected={props.isFocused}
			component="div"
			style={{
				fontWeight: props.isSelected ? 500 : 400,
			}}
			{...props.innerProps}
		>
			<ListItemText
				primary={props.children}
				secondary={props.data.description}
				secondaryTypographyProps={{
					component: 'span',
					inline: true,
					noWrap: false
				}}
			/>
		</StyledOption>
	);
}

/**
 * @param {Object} props
 * @return {JSX.Element}
 */
function Placeholder(props) {
	return (
		<StyledPlaceholder color="textSecondary" {...props.innerProps}>
			{props.children}
		</StyledPlaceholder>
	);
}

/**
 * @param {Object} props
 * @return {JSX.Element}
 */
function SingleValue(props) {
	return (
		<StyledSingleValue component="div" {...props.innerProps}>
			{props.children}
		</StyledSingleValue>
	);
}

/**
 * @param {Object} props
 * @return {JSX.Element}
 */
function ValueContainer(props) {
	return <StyledValueContainer>{props.children}</StyledValueContainer>;
}

/**
 * @param {Object} props
 * @return {JSX.Element}
 */
function Menu(props) {
	return (
		<StyledPaper square {...props.innerProps}>
			{props.children}
		</StyledPaper>
	);
}

/**
 * @return {JSX.Element}
 */
function DropdownIndicator() {
	return <div/>;
}

/**
 * @return {JSX.Element}
 */
function IndicatorSeparator() {
	return <div/>;
}

/**
 * @type {Object}
 */
const components = {
	Control,
	DropdownIndicator,
	IndicatorSeparator,
	Menu,
	NoOptionsMessage,
	Option,
	Placeholder,
	SingleValue,
	ValueContainer
};

/**
 * @param {string|null} inputValue
 * @return {string}
 */
function noOptionsMessage({inputValue}) {
	return inputValue === '' || inputValue === null
		? 'Start typing to search for entities' : 'No options';
}

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

		onChange(selectedOption.value);
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
				noOptionsMessage={noOptionsMessage}
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
	onChange: PropTypes.func.isRequired,
}

EntitySelect.defaultProps = {
	label: '',
}

export default EntitySelect;
