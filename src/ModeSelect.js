import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';

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
			<Select
				options={ModeSelect.options}
				defaultValue={ModeSelect.options.find(
					option => option.value === this.props.defaultValue
				)}
				onChange={selectedOption => this.props.onChange(selectedOption.value)}
				/>
		);
	}
}

ModeSelect.propTypes = {
	defaultValue: PropTypes.string,
	onChange: PropTypes.func,
};

export default ModeSelect;
