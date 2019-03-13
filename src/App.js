import React, { Component } from 'react';
import { QueryManagerContainer, ChartContainer, FormContainer } from './containers';
import './App.css';

class App extends Component {

	/**
	 * @inheritdoc
	 */
	render() {
		return (
			<div className="App">
				<QueryManagerContainer />
				<div className="App__form-container">
					<FormContainer />
				</div>
				<ChartContainer />
			</div>
		);
	}
}

export default App;
