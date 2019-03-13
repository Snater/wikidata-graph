import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ChartContainer, FormContainer } from './containers';
import QueryStringManager from './QueryStringManager';
import SparqlGenerator from './SparqlGenerator';
import Wikidata from './WikidataInterface';
import './App.css';

class App extends Component {

	/**
	 * @inheritdoc
	 */
	componentDidMount() {
		this.queryStringManager = new QueryStringManager(
			this.props.queryProps,
			this.props.onUpdateQueryProps
		);

		this.query(SparqlGenerator.generate(this.props.queryProps));
	}

	/**
	 * @param {string} sparqlQuery
	 * @return {Promise<Object[]>}
	 */
	query(sparqlQuery) {
		return Wikidata.sparqlQuery(sparqlQuery).then(data => {
			if (data) {
				this.props.onDataRetrieved(data);
			}
		});
	}

	/**
	 * @inheritdoc
	 */
	componentDidUpdate(prevProps) {
		const queryPropsChanged = !QueryStringManager.haveSameValues(
			this.props.queryProps,
			prevProps.queryProps
		);

		if (queryPropsChanged) {
			this.query(SparqlGenerator.generate(this.props.queryProps))
				.then(
					() => this.queryStringManager.updateQueryString(this.props.queryProps)
				);
		}
	}

	/**
	 * @inheritdoc
	 */
	render() {
		return (
			<div className="App">
				<div className="App__form-container">
					<FormContainer />
				</div>
				<ChartContainer />
			</div>
		);
	}
}

App.propTypes = {
	queryProps: PropTypes.shape({
		item: PropTypes.string,
		property: PropTypes.string,
		mode: PropTypes.string,
		language: PropTypes.string,
		iterations: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		sizeProperty: PropTypes.string,
	}),
	onDataRetrieved: PropTypes.func,
	onUpdateQueryProps: PropTypes.func,
};

export default App;
