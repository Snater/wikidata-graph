import {
	StyledNoOptionsMessage,
	StyledOption,
	StyledPaper,
	StyledPlaceholder,
	StyledSingleValue,
	StyledValueContainer,
} from './EntitySelect.styles';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import TextField from '@mui/material/TextField';

function Control({children, innerProps, innerRef, selectProps}) {
	return (
		<TextField
			InputProps={{
				inputComponent: 'div',
				inputProps: {children, ...innerProps}
			}}
			fullWidth
			inputRef={innerRef}
			{...selectProps.textFieldProps}
		/>
	);
}

function Menu({children, innerProps}) {
	return <StyledPaper square {...innerProps}>{children}</StyledPaper>;
}

function NoOptionsMessage({children, innerProps}) {
	return (
		<StyledNoOptionsMessage color="textSecondary" {...innerProps}>
			{children}
		</StyledNoOptionsMessage>
	);
}

function Option({children, data, innerProps, isFocused, isSelected}) {
	return (
		<StyledOption
			buttonRef={innerProps.innerRef}
			selected={isFocused}
			component="div"
			style={{
				fontWeight: isSelected ? 500 : 400,
			}}
			{...innerProps}
		>
			<ListItemText
				primary={children}
				secondary={data.description}
				secondaryTypographyProps={{component: 'span', display: 'inline', noWrap: false}}
			/>
		</StyledOption>
	);
}

function Placeholder({children, innerProps}) {
	return <StyledPlaceholder color="textSecondary" {...innerProps}>{children}</StyledPlaceholder>;
}

function SingleValue({children, innerProps}) {
	return <StyledSingleValue component="div" {...innerProps}>{children}</StyledSingleValue>;
}

function ValueContainer({children}) {
	return <StyledValueContainer>{children}</StyledValueContainer>;
}

function DropdownIndicator() {
	return <div/>;
}

function IndicatorSeparator() {
	return <div/>;
}

export default {
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