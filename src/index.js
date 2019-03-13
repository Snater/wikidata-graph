import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'roboto-fontface';
import App from './App';

const defaultQueryProps = {
	item: 'Q9682',
	property: 'P40',
	mode: 'both',
	language: 'en',
	iterations: 5,
	limit: 0,
	sizeProperty: 'P3373',
};

ReactDOM.render(<App defaultQueryProps={defaultQueryProps} />, document.getElementById('root'));
