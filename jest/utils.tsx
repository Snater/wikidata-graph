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

export * from '@testing-library/react';
export {customRender as render};
