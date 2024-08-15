'use client'

import {Roboto} from 'next/font/google';
import {createTheme} from '@mui/material';

const roboto = Roboto({subsets: ['latin'], weight: ['400']});
const theme = createTheme({
	typography: {
		fontFamily: roboto.style.fontFamily,
	},
});

export default theme;
