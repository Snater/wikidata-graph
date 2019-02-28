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
						onChange={value => this.setState({item: value})}
					/>
				</label>
				<label>
					Traversal Property
					<EntitySelect
						entityType="property"
						entityId={this.props.property}
						onChange={value => this.setState({property: value})}
					/>
				</label>
				<label>
					Mode
					<ModeSelect
						defaultValue={this.props.mode}
						onChange={value => this.setState({mode: value})}
					/>
				</label>
				<label>
					Language
					<LanguageSelect
						initialLanguage={this.props.language}
						onChange={value => this.setState({language: value})}
					/>
				</label>
				<label>
					Iterations
					<NumberInput
						defaultValue={this.props.iterations}
						onChange={value => this.setState({iterations: value})}
					/>
				</label>
				<label>
					Limit
					<NumberInput
						defaultValue={this.props.limit}
						onChange={value => this.setState({limit: value})}
					/>
				</label>
				<button onClick={this.update}>Update</button>
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
	onUpdate: PropTypes.func,
};

export default Form;
