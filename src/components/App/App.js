import React from 'react';
import ChartContainer from '../../containers/ChartContainer'
import FormContainer from '../../containers/FormContainer'
import QueryManagerContainer from '../../containers/QueryManagerContainer'
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
