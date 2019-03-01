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
	constructor(props) {
		super(props);
		this._textarea = React.createRef();
	}

	/**
	 * @param {Object} e
	 */
	submit = e => {
		e.preventDefault();
		this.props.onSubmit();
	};

	/**
	 * @param {string} query
	 */
	updateQuery(query) {
		this._textarea.current.value = query;
	}

	/**
	 * @inheritdoc
	 */
	render() {
		return (
			<form className="Form">
				<label>
					Root Item
					<EntitySelect
						entityType="item"
						entityId={this.props.item}
						onChange={value => this.props.onChange({item: value})}
					/>
				</label>
				<label>
					Traversal Property
					<EntitySelect
						entityType="property"
						entityId={this.props.property}
						onChange={value => this.props.onChange({property: value})}
					/>
				</label>
				<label>
					Mode
					<ModeSelect
						defaultValue={this.props.mode}
						onChange={value => this.props.onChange({mode: value})}
					/>
				</label>
				<label>
					Language
					<LanguageSelect
						initialLanguage={this.props.language}
						onChange={value => this.props.onChange({language: value})}
					/>
				</label>
				<label>
					Iterations
					<NumberInput
						defaultValue={this.props.iterations}
						onChange={value => this.props.onChange({iterations: value})}
					/>
				</label>
				<label>
					Limit
					<NumberInput
						defaultValue={this.props.limit}
						onChange={value => this.props.onChange({limit: value})}
					/>
				</label>
				<button onClick={this.submit}>Draw</button>
				<label className="Form__sparql">
					Generated SPARQL Query
					<textarea ref={this._textarea} readOnly={true} />
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
	onSubmit: PropTypes.func,
	onUpdate: PropTypes.func,
};

export default Form;
