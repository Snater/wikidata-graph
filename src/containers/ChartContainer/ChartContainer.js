import { connect } from 'react-redux'
import Wikidata from '../../lib/WikidataInterface';
import Chart from '../../components/Chart';

export default connect(
	state => ({
		data: state.data === null ? null : {...state.data},
		root: state.query.item,
		getEntityImage: Wikidata.getEntityImage,
	})
)(Chart);

