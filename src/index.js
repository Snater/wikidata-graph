import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const defaultQueryProperties = {
	item: 'Q9682',
	property: 'P40',
	mode: 'both',
	language: 'en',
	iterations: 5,
	limit: 0,
};

ReactDOM.render(<App defaultQueryProperties={defaultQueryProperties} />, document.getElementById('root'));
