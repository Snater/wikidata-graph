import { connect } from 'react-redux'
import { setData } from '../../redux-modules/data/actions';
import { updateQueryProps } from '../../redux-modules/queryProps/actions';
import QueryManager from '../../components/QueryManager';

export default connect(
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
)(QueryManager);
