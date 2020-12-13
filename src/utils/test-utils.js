import '@testing-library/jest-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import React from 'react';
import {ThemeProvider} from 'styled-components';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {render} from '@testing-library/react';

const theme = createMuiTheme();

const CustomWrapper = function({children}) {
	return (
		<MuiThemeProvider theme={theme}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</MuiThemeProvider>
	);
}

const customRender = (ui, options) => render(ui, {wrapper: CustomWrapper, ...options});

/**
 * See https://github.com/facebook/react/issues/10135#issuecomment-500929024
 *
 * @param {HTMLInputElement} input
 * @param {string} value
 */
export function setReactInputValue(input, value) {
	const previousValue = input.value;

	input.value = value;

	const tracker = input._valueTracker;
	if (tracker) {
		tracker.setValue(previousValue);
	}

	input.dispatchEvent(new Event('change', {bubbles: true}));
}

export * from '@testing-library/react';
export {customRender as render};