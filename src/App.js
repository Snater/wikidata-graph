import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Chart from './Chart';
import Form from './Form';
import SparqlGenerator from './SparqlGenerator';
import Wikidata from './WikidataInterface';
import './App.css';

class App extends Component {

	/**
	 * @inheritdoc
	 */
	constructor(props) {
		super(props);

		this._sparqlGenerator = new SparqlGenerator();

		this.state = {
			queryProps: {
				item: this.props.defaultQueryProps.item,
				property: this.props.defaultQueryProps.property,
				mode: this.props.defaultQueryProps.mode,
				language: this.props.defaultQueryProps.language,
				iterations: this.props.defaultQueryProps.iterations,
				limit: this.props.defaultQueryProps.limit,
			},
			sparqlQuery: '',
			data: null,
		}
	}

	/**
	 * @inheritdoc
	 */
	componentDidMount() {
		this.setState({
			sparqlQuery: this._sparqlGenerator.generate(this.state.queryProps)
		});
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
	 * @inheritdoc
	 */
	componentDidUpdate(prevProps, prevState) {
		const sparqlQuery = this._sparqlGenerator.generate(this.state.queryProps);

		if (sparqlQuery !== this.state.sparqlQuery) {
			this.setState({sparqlQuery: sparqlQuery});
		} else if (prevState.sparqlQuery !== this.state.sparqlQuery) {
			this.query(this.state.sparqlQuery);
		}
	}

	/**
	 * @inheritdoc
	 */
	render() {
		return (
			<div className="App">
				<div className="App__form-container">
					<Form
						{...this.props.defaultQueryProps}
						onChange={value => this.setState(
							{queryProps: Object.assign(this.state.queryProps, value)}
						)}
						sparqlQuery={this.state.sparqlQuery}
					/>
				</div>
				{this.state.data === null ? 'loading' : <Chart data={this.state.data} />}
			</div>
		);
	}
}

App.propTypes = {
	defaultQueryProps: PropTypes.object,
};

export default App;
