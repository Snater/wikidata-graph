import { connect } from 'react-redux'
import { setData, updateQueryProps } from './store/actions';
import App from './App';
import Chart from './Chart';
import Form from './Form';
import Wikidata from './WikidataInterface';

export const AppContainer = connect(
	state => ({
		queryProps: {...state.query},
	}),
	dispatch => ({
		onUpdateQueryProps(queryProps) {
			dispatch(updateQueryProps(queryProps));
		},
		onDataRetrieved(data) {
			dispatch(setData(data));
		}
	})
)(App);

export const ChartContainer = connect(
	state => ({
		data: state.data === null ? null : {...state.data},
		root: state.query.item,
		getEntityImage: Wikidata.getEntityImage,
	})
)(Chart);

export const FormContainer = connect(
	state => ({
		queryProps: {...state.query},
	}),
	dispatch => ({
		onChange(queryProp) {
			dispatch(updateQueryProps(queryProp));
		}
	})
)(Form);
