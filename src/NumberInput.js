import PropTypes from 'prop-types';
import React, { Component } from 'react';

class NumberInput extends Component {

	/**
	 * @inheritdoc
	 */
	render() {
		return (
			<input
				type="number"
				min="0"
				defaultValue={this.props.defaultValue}
				onChange={e => this.props.onChange(parseInt(e.target.value))}
			/>
		)
	}
}

NumberInput.propTypes = {
	defaultValue: PropTypes.number,
	onChange: PropTypes.func,
};

export default NumberInput;
