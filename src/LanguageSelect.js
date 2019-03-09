import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import NoSsr from '@material-ui/core/NoSsr';
import Select from '@material-ui/core/Select';
import WikidataInterface from './WikidataInterface';

class LanguageSelect extends Component {

	/**
	 * @inheritdoc
	 */
	constructor(props) {
		super(props);

		this.state = {
			languages: [],
			value: props.defaultValue,
		}
	}

	/**
	 * @inheritdoc
	 */
	componentDidMount() {
		// Initially load list of available languages:
		WikidataInterface.getLanguages()
			.then(results =>
				this.setState({
					languages: results.map(
						result => Object.create({value: result.code, label: result.label})
					)
				})
			);
	}

	/**
	 * @inheritdoc
	 */
	componentDidUpdate(prevProps, prevState) {
		if (this.state.value !== prevState.value) {
			this.props.onChange(this.state.value);
		}

		// Languages are filled just once, so simply comparing length is sufficient:
		if (this.state.languages.length !== prevState.languages.length) {
			if (!this.state.languages.length) {
				throw new Error('Trying to update state with empty languages')
			}

			this.setState({
				value: this.state.languages.filter(
					language => language.value === this.props.defaultValue
				)[0]['value']
			});
		}
	}

	/**
	 * @inheritdoc
	 */
	render() {
		return (
			<FormControl margin="dense">
				<InputLabel htmlFor={this.props.id}>Language</InputLabel>
				<NoSsr>
					<Select
						inputProps={{
							id: this.props.id
						}}
						value={this.state.value}
						onChange={e => this.setState({value: e.target.value})}
					>
						{this.state.languages.map(
							option => <MenuItem
								key={`${option.value}__${option.label}`}
								value={option.value}
							>{option.label}</MenuItem>
						)}
					</Select>
				</NoSsr>
			</FormControl>
		);
	}
}

LanguageSelect.propTypes = {
	id: PropTypes.string.isRequired,
	defaultValue: PropTypes.string,
	onChange: PropTypes.func,
};

export default LanguageSelect;
