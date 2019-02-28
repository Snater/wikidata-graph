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

		this.state = {
			item: this.props.item,
			property: this.props.property,
			mode: this.props.mode,
			language: this.props.language,
			iterations: this.props.iterations,
			limit: this.props.limit,
		}
	}

	/**
	 * @param {Object} e
	 */
	update = e => {
		e.preventDefault();
		this.props.onUpdate(this.state);
	};

	/**
	 * @param {string} value
	 * @param {string} formElementKey
	 */
	changeValue(value, formElementKey) {
		this.setState({[formElementKey]: value});
	}

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
				<EntitySelect entityType="item" entityId={this.props.item} onChange={value => this.changeValue(value, 'item')} />
				<EntitySelect entityType="property" entityId={this.props.property} onChange={value => this.changeValue(value, 'property')} />
				<ModeSelect defaultValue={this.props.mode} onChange={value => this.changeValue(value, 'mode')} />
				<LanguageSelect initialLanguage={this.props.language} onChange={value => this.changeValue(value, 'language')}/>
				<NumberInput defaultValue={this.props.iterations} onChange={value => this.changeValue(value, 'iterations')} />
				<NumberInput defaultValue={this.props.limit} onChange={value => this.changeValue(value, 'limit')} />
				<textarea ref={this._textarea} />
				<button onClick={this.update}>Update</button>
			</form>
		);
	}
}

export default Form;
