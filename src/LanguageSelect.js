import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';
import WikidataInterface from './WikidataInterface';

class LanguageSelect extends Component {

	/**
	 * @inheritdoc
	 */
	constructor(props) {
		super(props);

		this._select = React.createRef();

		this.state = {
			languages: [],
		}
	}

	/**
	 * @inheritdoc
	 */
	componentDidMount() {
		WikidataInterface.getLanguages()
			.then(results => {
				this.setState({
					languages: results.map(
						result => Object.create({value: result.code, label: result.label})
					)
				});
			});
	}

	/**
	 * @inheritdoc
	 */
	componentDidUpdate(prevProps, prevState) {
		// Languages are filled just once, so simply comparing length is sufficient:
		if (this.state.languages.length !== prevState.languages.length) {
			const defaultLanguage = this.state.languages
				.filter(language => language.value === this.props.initialLanguage)[0];

			this._select.current.setState({
				value: {
					value: defaultLanguage.language,
					label: defaultLanguage.label,
				}
			});
		}
	}

	/**
	 * @param {Object} selectedOption
	 */
	handleChange = selectedOption => this.props.onChange(selectedOption);

	/**
	 * @inheritdoc
	 */
	render() {
		return (
			<Select ref={this._select} options={this.state.languages} onChange={selectedOption => this.handleChange(selectedOption)} />
		);
	}
}

LanguageSelect.propTypes = {
	initialLanguage: PropTypes.string,
	onChange: PropTypes.func,
};

export default LanguageSelect;
