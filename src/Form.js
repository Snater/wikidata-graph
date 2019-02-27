import React, { Component } from 'react';
import './Form.css';

class Form extends Component {

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
	 * @param {Object} e
	 * @param {string} formElementKey
	 */
	handleChange(e, formElementKey) {
		this.setState({[formElementKey]: e.target.value})
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
				<input type="text" defaultValue={this.props.item} onChange={e => this.handleChange(e, 'item')} placeholder="Root Item" />
				<input type="text" defaultValue={this.props.property} onChange={e => this.handleChange(e, 'property')} placeholder="Traversal Property" />
				<input type="text" defaultValue={this.props.mode} onChange={e => this.handleChange(e, 'mode')} placeholder="Mode" />
				<input type="text" defaultValue={this.props.language} onChange={e => this.handleChange(e, 'language')} placeholder="Language" />
				<input type="text" defaultValue={this.props.iterations} onChange={e => this.handleChange(e, 'iterations')} placeholder="Iterations" />
				<input type="text" defaultValue={this.props.limit} onChange={e => this.handleChange(e, 'limit')} placeholder="Limit" />
				<textarea ref={this._textarea} />
				<button onClick={this.update}>Update</button>
			</form>
		);
	}
}

export default Form;
