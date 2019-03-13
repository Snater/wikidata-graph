import { connect } from 'react-redux'
import { setData, updateQueryProps } from './store/actions';
import App from './App';
import Form from './Form';

export const AppContainer = connect(
	state => ({
		data: state.data === null ? null : {...state.data},
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
