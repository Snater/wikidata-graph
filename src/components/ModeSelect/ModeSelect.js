import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

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
			<FormControl margin="dense">
				<InputLabel htmlFor={this.props.id}>Direction</InputLabel>
				<Select
					inputProps={{
						id: this.props.id
					}}
					value={this.props.value}
					onChange={e => this.props.onChange(e.target.value)}
				>
					{ModeSelect.options.map(option =>
						<MenuItem
							key={option.value}
							value={option.value}
						>{option.label}</MenuItem>
					)}
				</Select>
			</FormControl>
		);
	}
}

ModeSelect.propTypes = {
	id: PropTypes.string.isRequired,
	value: PropTypes.string,
	onChange: PropTypes.func,
};

export default ModeSelect;
