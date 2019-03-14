import React from 'react';
import { QueryManagerContainer, ChartContainer, FormContainer } from './containers';
import styles from './App.module.css';

export default () => (
	<div className={styles.App}>
		<QueryManagerContainer />
		<div className={styles.formContainer}>
			<FormContainer />
		</div>
		<ChartContainer />
	</div>
);
