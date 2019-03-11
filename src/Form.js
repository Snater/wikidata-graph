import PropTypes from 'prop-types';
import React, { Component } from 'react';
import EntitySelect from './EntitySelect';
import LanguageSelect from './LanguageSelect';
import ModeSelect from './ModeSelect';
import NumberInput from './NumberInput';
import './Form.css';

class Form extends Component {

	/**
	 * @inheritdoc
	 */
	render() {
		return (
			<form className="Form">
				<EntitySelect
					entityType="item"
					entityId={this.props.item}
					onChange={value => this.props.onChange({item: value})}
					label="Root Item"
				/>
				<EntitySelect
					entityType="property"
					entityId={this.props.property}
					onChange={value => this.props.onChange({property: value})}
					label="Traversal Property"
				/>
				<div className="Form__2-col">
					<ModeSelect
						id="mode"
						defaultValue={this.props.mode}
						onChange={value => this.props.onChange({mode: value})}
					/>
					<LanguageSelect
						id="language"
						defaultValue={this.props.language}
						onChange={value => this.props.onChange({language: value})}
					/>
				</div>
				<div className="Form__2-col">
					<NumberInput
						label="Iterations"
						defaultValue={this.props.iterations}
						onChange={value => this.props.onChange({iterations: value})}
					/>
					<NumberInput
						label="Limit"
						defaultValue={this.props.limit}
						onChange={value => this.props.onChange({limit: value})}
					/>
				</div>
				<EntitySelect
					entityType="property"
					entityId={this.props.sizeProperty}
					onChange={value => this.props.onChange({sizeProperty: value})}
					label="Circle Size Property"
				/>
				<label className="Form__sparql">
					Generated SPARQL Query
					<textarea value={this.props.sparqlQuery} readOnly={true} />
				</label>
			</form>
		);
	}
}

Form.propTypes = {
	item: PropTypes.string,
	property: PropTypes.string,
	mode: PropTypes.string,
	language: PropTypes.string,
	iterations: PropTypes.number,
	limit: PropTypes.number,
	sizeProperty: PropTypes.string,
	sparqlQuery: PropTypes.string,
};

export default Form;
