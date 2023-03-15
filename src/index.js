import {ThemeProvider as MuiThemeProvider, createTheme} from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import 'roboto-fontface';
import {ThemeProvider} from 'styled-components';

const theme = createTheme();

ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<ThemeProvider theme={theme}>
			<App/>
		</ThemeProvider>
	</MuiThemeProvider>,
	document.getElementById('root')
);