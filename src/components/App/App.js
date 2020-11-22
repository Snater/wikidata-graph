import React from 'react';
import Chart from '../Chart';
import QueryManager from '../QueryManager';
import {QueryContextProvider} from './QueryContext';
import WikidataInterface from '../../lib/WikidataInterface';
import {StyledApp, StyledFormContainer} from './App.styles';
import Form from '../Form';

export default () => (
	<StyledApp>
		<QueryContextProvider>
			<QueryManager/>
			<StyledFormContainer>
				<Form/>
			</StyledFormContainer>
			<Chart getEntityImage={WikidataInterface.getEntityImage}/>
		</QueryContextProvider>
	</StyledApp>
);
