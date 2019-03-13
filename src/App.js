import React from 'react';
import { QueryManagerContainer, ChartContainer, FormContainer } from './containers';
import './App.css';

export default () => (
	<div className="App">
		<QueryManagerContainer />
		<div className="App__form-container">
			<FormContainer />
		</div>
		<ChartContainer />
	</div>
);
