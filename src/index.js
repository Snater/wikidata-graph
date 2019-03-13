import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { AppContainer } from './containers';
import './index.css';
import 'roboto-fontface';

ReactDOM.render(
	<Provider store={store} ><AppContainer /></Provider>,
	document.getElementById('root')
);
