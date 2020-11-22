import PropTypes from 'prop-types';
import React, { Component } from 'react';
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

class EntitySelect extends Component {

	/**
	 * @inheritdoc
	 */
	constructor(props) {
		super(props);

		this._currentValue = null;

		this.state = {
			value: null,
			placeholder: 'Start typing to search for an entity',
		}
	}

	/**
	 * @inheritdoc
	 */
	componentDidMount() {
		if (this.props.entityId) {
			this.initValueByEntityId();
		}
	}

	/**
	 * @inheritdoc
	 */
	componentDidUpdate(prevProps, prevState) {
		if (this.state.value !== null) {
			this._currentValue = this.state.value;
		}

		const value = this.state.value;

		if (
			this.props.entityId !== null
			&& this.props.entityId !== prevProps.entityId
			&& (value === null || value.value !== this.props.entityId)
		) {
			// When the entity prop is updated, the component needs to re-init its
			// value for retrieving the entity label.
			this.initValueByEntityId()
				.then(() => {
					if (value === null) {
						// Reset the internal value to NULL, if the value set before
						// re-initialising was NULL (the input element is focused).
						this.setState({value: null})
					}
				});
		}
	}

	/**
	 * @return {Promise<Object>}
	 */
	initValueByEntityId() {
		return WikidataInterface.search(this.props.entityId, this.props.entityType)
			.then(response => this.setState({
				value: {
					value: response.search[0].value,
					label: response.search[0].label
				},
				placeholder: response.search[0].label,
			}));
	}

	/**
	 * @param {Object} selectedOption
	 */
	handleChange = selectedOption => {
		this.setState({
			value: {
				value: selectedOption.value,
				label: selectedOption.label,
			},
			placeholder: selectedOption.label,
		});
		this.props.onChange(selectedOption.value);
	};

	/**
	 * @inheritdoc
	 */
	render() {
		const selectStyles = {
			input: base => ({
				...base,
				// color: theme.palette.text.primary,
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
					loadOptions={value => loadOptions(value, this.props.entityType)}
					onChange={selectedOption => this.handleChange(selectedOption)}
					onFocus={() => this.setState({value: null})}
					onBlur={() => this.setState({value: this._currentValue})}
					noOptionsMessage={noOptionsMessage}
					placeholder={this.state.placeholder}
					value={this.state.value}
					textFieldProps={{
						label: this.props.label,
						InputLabelProps: {
							shrink: true,
						},
					}}
				/>
			</FormControl>
		);
	}
}

EntitySelect.propTypes = {
	entityType: PropTypes.string,
	entityId: PropTypes.string,
	onChange: PropTypes.func,
};

export default EntitySelect;
