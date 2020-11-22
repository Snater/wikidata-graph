import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import 'roboto-fontface';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import {ThemeProvider} from 'styled-components';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const theme = createMuiTheme();

ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<ThemeProvider theme={theme}>
			<App/>
		</ThemeProvider>
	</MuiThemeProvider>,
	document.getElementById('root')
);
