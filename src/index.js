import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import 'roboto-fontface';
import {ThemeProvider as MuiThemeProvider} from '@material-ui/core/styles';
import {ThemeProvider} from 'styled-components';
import createTheme from '@material-ui/core/styles/createTheme';

const theme = createTheme();

ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<ThemeProvider theme={theme}>
			<App/>
		</ThemeProvider>
	</MuiThemeProvider>,
	document.getElementById('root')
);