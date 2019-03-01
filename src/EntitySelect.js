import PropTypes from 'prop-types';
import React, { Component } from 'react';
import AsyncSelect from 'react-select/lib/Async';
import WikidataInterface from './WikidataInterface';
import './EntitySelect.css';

class EntitySelect extends Component {

	/**
	 * @inheritdoc
	 */
	constructor(props) {
		super(props);

		this._select = React.createRef();
	}

	/**
	 * @inheritdoc
	 */
	componentDidMount() {
		WikidataInterface.search(this.props.entityId, this.props.entityType)
			.then(response => {
				this._select.current.select.setState({
					value: {
						value: response.search[0].value,
						label: response.search[0].label
					},
				});
			});
	}

	/**
	 * @param {string} input
	 * @return {Promise}
	 */
	loadOptions = input => {
		return WikidataInterface.search(input, this.props.entityType)
			.then(response => response.search.map(
				result => Object.create({
					value: result.id,
					label: result.label,
					description: result.description,
				})
			));
	};

	/**
	 * @param {Object} selectedOption
	 */
	handleChange = selectedOption => this.props.onChange(selectedOption.value);

	resetSelect = () => this._select.current.setState({defaultOptions: []});

	/**
	 * @param {Object} option
	 * @return {*}
	 */
	formatOptionLabel(option) {
		return (
			<div className="EntitySelect__option">
				<div className="EntitySelect__option__label">{option.label}</div>
				<div className="EntitySelect__option__description">{option.description}</div>
			</div>
		);
	}

	/**
	 * @param {string|null} inputValue
	 * @return {string}
	 */
	noOptionsMessage({inputValue}) {
		return inputValue === '' || inputValue === null
			? 'Start typing to search for entities' : 'No options';
	}

	render() {
		return(
			<AsyncSelect
				ref={this._select}
				loadOptions={this.loadOptions}
				onChange={selectedOption => this.handleChange(selectedOption)}
				onKeyDown={e => this.resetSelect()}
				className="EntitySelect"
				classNamePrefix="EntitySelect"
				formatOptionLabel={this.formatOptionLabel}
				noOptionsMessage={this.noOptionsMessage}
			/>
		);
	}
}

EntitySelect.propTypes = {
	entityType: PropTypes.string,
	entityId: PropTypes.string,
	onChange: PropTypes.func,
};

export default EntitySelect;
