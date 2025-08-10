import Box from '@mui/material/Box';
import Graph from '@/components/Graph';
import Drawer from '@/components/Drawer';
import {QueryContextProvider} from './QueryContext';
import QueryManager from '@/components/QueryManager';
import React from 'react';

export default function App() {
	return (
		<Box display="flex" height={1} width={1}>
			<QueryContextProvider>
				<QueryManager/>
				<Drawer/>
				<Graph/>
			</QueryContextProvider>
		</Box>
	);
}
