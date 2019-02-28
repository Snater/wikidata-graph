import React, { Component } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import WikidataInterface from './WikidataInterface';
import './Form.css';

class Form extends Component {

	/**
	 * @inheritdoc
	 */
	constructor(props) {
		super(props);
		this._itemSelect = React.createRef();
		this._propertySelect = React.createRef();
		this._languageSelect = React.createRef();
		this._textarea = React.createRef();

		this.state = {
			item: this.props.item,
			property: this.props.property,
			mode: this.props.mode,
			language: this.props.language,
			iterations: this.props.iterations,
			limit: this.props.limit,
			languages: [],
		}
	}

	/**
	 * @inheritdoc
	 */
	componentDidMount() {
		this.initAsyncSelect(this._itemSelect, this.props.item);
		this.initAsyncSelect(this._propertySelect, this.props.property, 'property');

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
				.filter(language => language.value === this.props.language)[0];

			this._languageSelect.current.setState({
				value: {
					value: defaultLanguage.language,
					label: defaultLanguage.label,
				}
			});
		}
	}

	/**
	 * @param {Object} asyncSelectRef
	 * @param {string} search
	 * @param {string} [type]
	 */
	initAsyncSelect(asyncSelectRef, search, type) {
		WikidataInterface.search(search, type)
			.then(response => {
				asyncSelectRef.current.setState({
					defaultOptions: response.search.map(
						result => Object.create({value: result.id, label: result.label})
					),
				});

				asyncSelectRef.current.select.setState({
					value: {
						value: response.search[0].value,
						label: response.search[0].label
					},
				});
			});
	}

	/**
	 * @param {Object} e
	 */
	update = e => {
		e.preventDefault();
		this.props.onUpdate(this.state);
	};

	/**
	 * @param {Object} e
	 * @param {string} formElementKey
	 */
	handleChange(e, formElementKey) {
		this.setState({[formElementKey]: e.target.value});
	}

	/**
	 * @param {Object} selectedOption
	 * @param {string} formElementKey
	 */
	handleSelectChange(selectedOption, formElementKey) {
		this.setState({[formElementKey]: selectedOption.value});
	}

	/**
	 * @param {Object} selectRef
	 */
	resetSelect = selectRef => {
		selectRef.current.setState({defaultOptions: []});
	};

	/**
	 * @param {string} input
	 * @return {Promise}
	 */
	itemOptions = input => {
		return this.retrieveOptions(input);
	};

	/**
	 * @param {string} input
	 * @return {Promise}
	 */
	propertyOptions = input => {
		return this.retrieveOptions(input, 'property');
	};

	/**
	 * @param {string} input
	 * @param {string} [type]
	 * @return {Promise}
	 */
	retrieveOptions(input, type) {
		return WikidataInterface.search(input, type)
			.then(response => response.search.map(
				result => Object.create({value: result.id, label: result.label})
			));
	}

	/**
	 * @param {string} query
	 */
	updateQuery(query) {
		this._textarea.current.value = query;
	}

	render() {
		return (
			<form className="Form">
				<AsyncSelect ref={this._itemSelect} loadOptions={this.itemOptions} defaultValue={this.props.item} onChange={selectedOption => this.handleSelectChange(selectedOption, 'item')} onKeyDown={e => this.resetSelect(this._itemSelect)} placeholder="Root Item" />
				<AsyncSelect ref={this._propertySelect} loadOptions={this.propertyOptions} defaultValue={this.props.property} onChange={selectedOption => this.handleSelectChange(selectedOption, 'property')} onKeyDown={e => this.resetSelect(this._propertySelect)} placeholder="Traversal Property" />
				<input type="text" defaultValue={this.props.mode} onChange={e => this.handleChange(e, 'mode')} placeholder="Mode" />
				<Select ref={this._languageSelect} options={this.state.languages} defaultValue={this.props.language} onChange={selectedOption => this.handleSelectChange(selectedOption, 'language')} />
				<input type="text" defaultValue={this.props.iterations} onChange={e => this.handleChange(e, 'iterations')} placeholder="Iterations" />
				<input type="text" defaultValue={this.props.limit} onChange={e => this.handleChange(e, 'limit')} placeholder="Limit" />
				<textarea ref={this._textarea} />
				<button onClick={this.update}>Update</button>
			</form>
		);
	}
}

export default Form;
