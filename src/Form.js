import React, { Component } from 'react';
import './Form.css';

class Form extends Component {

	constructor(props) {
		super(props);
		this._textarea = React.createRef();
	}

	update = e => {
		e.preventDefault();
		this.props.onUpdate(this._textarea.current.value);
	};

	render() {
		return (
			<form className="Form">
				<textarea ref={this._textarea} defaultValue={this.props.defaultQuery} />
				<button onClick={this.update}>Update</button>
			</form>
		);
	}
}

export default Form;
