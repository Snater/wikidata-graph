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
				<EntitySelect
					entityType="item"
					entityId={this.props.item}
					onChange={value => this.setState({item: value})}
				/>
				<EntitySelect
					entityType="property"
					entityId={this.props.property}
					onChange={value => this.setState({property: value})}
				/>
				<ModeSelect
					defaultValue={this.props.mode}
					onChange={value => this.setState({mode: value})}
				/>
				<LanguageSelect
					initialLanguage={this.props.language}
					onChange={value => this.setState({language: value})}
				/>
				<NumberInput
					defaultValue={this.props.iterations}
					onChange={value => this.setState({iterations: value})}
				/>
				<NumberInput
					defaultValue={this.props.limit}
					onChange={value => this.setState({limit: value})}
				/>
				<textarea ref={this._textarea} />
				<button onClick={this.update}>Update</button>
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
