import './global.css';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter';
import {Metadata} from 'next';
import {PropsWithChildren} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import theme from '@/theme';
import {CssBaseline} from '@mui/material';

export const metadata: Metadata = {
	title: 'Wikidata Graph',
};

type Props = Readonly<PropsWithChildren>

export default function RootLayout({children}: Props) {
	return (
		<html lang="en">
			<body>
				<AppRouterCacheProvider>
					<CssBaseline/>
					<ThemeProvider theme={theme}>{children}</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
