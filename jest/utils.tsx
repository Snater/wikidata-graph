import '@testing-library/jest-dom';
import React, {PropsWithChildren, ReactElement} from 'react';
import {RenderOptions, RenderResult, render} from '@testing-library/react';
import {ThemeProvider, createTheme} from '@mui/material';

const theme = createTheme();

const CustomWrapper = function({children}: PropsWithChildren) {
	return (<ThemeProvider theme={theme}>{children}</ThemeProvider>);
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>): RenderResult =>
	render(ui, {wrapper: CustomWrapper, ...options});

interface WrapperState {
	_valueTracker? : {
		getValue(): string,
		setValue(value: string): void,
		stopTracking(): void,
	}
}

/**
 * See https://github.com/facebook/react/issues/10135#issuecomment-500929024
 */
export function setReactInputValue(input: HTMLInputElement & WrapperState, value: string): void {
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
