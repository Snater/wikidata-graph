import Box from '@mui/material/Box';
import Chart from '../Chart';
import Form from '../Form';
import {QueryContextProvider} from './QueryContext';
import QueryManager from '../QueryManager';
import React from 'react';
import WikidataInterface from '../../lib/WikidataInterface';

export default function App() {
	return (
		<Box display="flex" height={1} width={1}>
			<QueryContextProvider>
				<QueryManager/>
				<Box
					bgcolor="common.white"
					boxShadow={8}
					height={1}
					maxHeight={1}
					position="absolute"
					sx={{
						overflowY: 'auto',
					}}>
					<Form/>
				</Box>
				<Chart getEntityImage={WikidataInterface.getEntityImage}/>
			</QueryContextProvider>
		</Box>
	);
};