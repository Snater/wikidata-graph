import PropTypes from 'prop-types';
import React, { Component } from 'react';

class ModeSelect extends Component {

	/**
	 * @type {Object[]}
	 */
	static options = [
		{value: 'forward', label: 'Forward'},
		{value: 'reverse', label: 'Reverse'},
		{value: 'both', label: 'Bidirectional'},
	];

	/**
	 * @inheritdoc
	 */
	render() {
		return (
			<select
				defaultValue={this.props.defaultValue}
				onChange={e => this.props.onChange(e.target.value)}>
				{ModeSelect.options.map(
					option => <option value={option.value}>{option.label}</option>
				)}
			</select>
		);
	}
}

ModeSelect.propTypes = {
	defaultValue: PropTypes.string,
	onChange: PropTypes.func,
};

export default ModeSelect;
