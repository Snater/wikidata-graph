import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Chart from './Chart';
import Form from './Form';
import Wikidata from './WikidataInterface';

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			data: null,
		}
	}

	componentDidMount() {
		this.query(this.props.defaultQuery);
	}

	/**
	 * @param {string} sparqlQuery
	 */
	query(sparqlQuery) {
		Wikidata.sparqlQuery(sparqlQuery).then(data => {
			if (data) {
				this.setState({data: data});
			}
		});
	};

	/**
	 * @param {string} sparqlQuery
	 */
	onFormUpdate = sparqlQuery => {
		this.query(sparqlQuery);
	};

	render() {
		return (
			<div className="App">
				<Form defaultQuery={this.props.defaultQuery} onUpdate={this.onFormUpdate} />
				{this.state.data === null ? 'loading' : <Chart data={this.state.data} />}
			</div>
		);
	}
}

Chart.propTypes = {
	query: PropTypes.string,
};

export default App;
