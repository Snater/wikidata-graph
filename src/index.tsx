import {ThemeProvider, createTheme} from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import 'roboto-fontface';

const theme = createTheme();

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<App/>
	</ThemeProvider>,
	document.getElementById('root')
);