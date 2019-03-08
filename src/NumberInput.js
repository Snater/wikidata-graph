import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

class NumberInput extends Component {

	/**
	 * @inheritdoc
	 */
	render() {
		return (
			<TextField
				label={this.props.label}
				type="number"
				inputProps={{min: 0}}
				defaultValue={this.props.defaultValue}
				onChange={e => this.props.onChange(parseInt(e.target.value))}
			/>
		)
	}
}

NumberInput.propTypes = {
	defaultValue: PropTypes.number,
	label: PropTypes.string,
	onChange: PropTypes.func,
};

export default NumberInput;
