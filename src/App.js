import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Chart from './Chart';
import Wikidata from './WikidataInterface';

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			data: null,
		}
	}

	componentDidMount() {
		Wikidata.sparqlQuery(this.props.query).then(data => {
			this.setState({data: data});
		});
	}

	render() {
		return (
			this.state.data === null ? 'loading' : <Chart data={this.state.data} />
		);
	}
}

Chart.propTypes = {
	query: PropTypes.string,
};

export default App;
