import { connect } from 'react-redux'
import { updateQueryProps } from '../../redux-modules/queryProps/actions';
import Form from '../../components/Form';

export default connect(
	state => ({
		queryProps: {...state.query},
	}),
	dispatch => ({
		onChange(queryProp) {
			dispatch(updateQueryProps(queryProp));
		}
	})
)(Form);
