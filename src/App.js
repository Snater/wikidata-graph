import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Chart from './Chart';
import Form from './Form';
import SparqlGenerator from './SparqlGenerator';
import Wikidata from './WikidataInterface';
import './App.css';

class App extends Component {

	constructor(props) {
		super(props);

		this._sparqlGenerator = new SparqlGenerator();

		this._form = React.createRef();

		this.state = {
			data: null,
		}
	}

	componentDidMount() {
		this.updateChart(this._form.current.state);
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
	 * @param {Object} queryData
	 */
	updateChart = queryData => {
		const query = this._sparqlGenerator.generate(queryData);
		this._form.current.updateQuery(query);
		this.query(query);
	};

	render() {
		return (
			<div className="App">
				<div className="App__form-container">
					<Form
						ref={this._form}
						{...this.props.defaultQueryProperties}
						onUpdate={this.updateChart} />
				</div>
				{this.state.data === null ? 'loading' : <Chart data={this.state.data} />}
			</div>
		);
	}
}

Chart.propTypes = {
	query: PropTypes.string,
};

export default App;
