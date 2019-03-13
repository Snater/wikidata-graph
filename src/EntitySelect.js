import PropTypes from 'prop-types';
import React, { Component } from 'react';
import AsyncSelect from 'react-select/lib/Async';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import NoSsr from '@material-ui/core/NoSsr';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import WikidataInterface from './WikidataInterface';

/**
 * @param {Object} theme
 */
const styles = theme => ({
	input: {
		display: 'flex',
		padding: 0,
	},
	valueContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		flex: 1,
		alignItems: 'center',
		overflow: 'hidden',
	},
	noOptionsMessage: {
		padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
	},
	singleValue: {
		fontSize: 16,
	},
	placeholder: {
		position: 'absolute',
		left: 2,
		fontSize: 16,
	},
	paper: {
		position: 'absolute',
		zIndex: 1,
		marginTop: theme.spacing.unit,
		left: 0,
		right: 0,
	},
	option: {
		height: 'auto',
		whiteSpace: 'normal',
	},
});

/**
 * @param {Object} props
 * @return {JSX}
 */
function NoOptionsMessage(props) {
	return (
		<Typography
			color="textSecondary"
			className={props.selectProps.classes.noOptionsMessage}
			{...props.innerProps}
		>
			{props.children}
		</Typography>
	);
}

/**
 * @param {Object} inputRef
 * @param {Object} props
 * @return {JSX}
 */
function inputComponent({inputRef, ...props}) {
	return (<div ref={inputRef} {...props} />);
}

/**
 * @param {Object} props
 * @return {JSX}
 */
function Control(props) {
	return (
		<TextField
			fullWidth
			InputProps={{
				inputComponent,
				inputProps: {
					className: props.selectProps.classes.input,
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
 * @return {JSX}
 */
function Option(props) {
	return (
		<MenuItem
			buttonRef={props.innerRef}
			selected={props.isFocused}
			component="div"
			className={props.selectProps.classes.option}
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
		</MenuItem>
	);
}

/**
 * @param {Object} props
 * @return {JSX}
 */
function Placeholder(props) {
	return (
		<Typography
			color="textSecondary"
			className={props.selectProps.classes.placeholder}
			{...props.innerProps}
		>
			{props.children}
		</Typography>
	);
}

/**
 * @param {Object} props
 * @return {JSX}
 */
function SingleValue(props) {
	return (
		<Typography
			className={props.selectProps.classes.singleValue}
			component="div"
			{...props.innerProps}
		>
			{props.children}
		</Typography>
	);
}

/**
 * @param {Object} props
 * @return {JSX}
 */
function ValueContainer(props) {
	return (
		<div className={props.selectProps.classes.valueContainer}>
			{props.children}
		</div>
	);
}

/**
 * @param {Object} props
 * @return {JSX}
 */
function Menu(props) {
	return (
		<Paper
			square
			className={props.selectProps.classes.paper}
			{...props.innerProps}
		>
			{props.children}
		</Paper>
	);
}

/**
 * @return {JSX}
 */
function DropdownIndicator() {
	return <div/>;
}

/**
 * @return {JSX}
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
		const {classes, theme} = this.props;

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
				<NoSsr>
					<AsyncSelect
						classes={classes}
						styles={selectStyles}
						components={components}
						loadOptions={value => loadOptions(value, this.props.entityType)}
						onChange={selectedOption => this.handleChange(selectedOption)}
						onFocus={e => this.setState({value: null})}
						onBlur={e => this.setState({value: this._currentValue})}
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
				</NoSsr>
			</FormControl>
		);
	}
}

EntitySelect.propTypes = {
	entityType: PropTypes.string,
	entityId: PropTypes.string,
	onChange: PropTypes.func,
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(EntitySelect);
