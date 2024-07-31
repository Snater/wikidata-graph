import './index.css';
import 'roboto-fontface';
import {ThemeProvider, createTheme} from '@mui/material';
import App from './components/App';
import React from 'react';
import {createRoot} from 'react-dom/client';

const theme = createTheme();

const root = createRoot(document.getElementById('root'));

root.render(
	<ThemeProvider theme={theme}>
		<App/>
	</ThemeProvider>
);
