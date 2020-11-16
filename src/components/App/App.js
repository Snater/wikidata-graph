import React from 'react';
import Chart from '../Chart';
import QueryManager from '../QueryManager';
import styles from './App.module.css';
import {QueryContextProvider} from './QueryContext';
import Form from '../Form';
import WikidataInterface from '../../lib/WikidataInterface';

export default () => (
	<div className={styles.App}>
		<QueryContextProvider>
			<QueryManager/>
			<div className={styles.formContainer}>
				<Form/>
			</div>
			<Chart getEntityImage={WikidataInterface.getEntityImage}/>
		</QueryContextProvider>
	</div>
);
