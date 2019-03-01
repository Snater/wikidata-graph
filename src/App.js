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

		this._form = React.createRef();

		this.state = {
			queryProps: {
				item: this.props.defaultQueryProps.item,
				property: this.props.defaultQueryProps.property,
				mode: this.props.defaultQueryProps.mode,
				language: this.props.defaultQueryProps.language,
				iterations: this.props.defaultQueryProps.iterations,
				limit: this.props.defaultQueryProps.limit,
			},
			data: null,
		}
	}

	/**
	 * @inheritdoc
	 */
	componentDidMount() {
		this.updateChart(this.state.queryProps);
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

	updateChart = () => {
		const query = this._sparqlGenerator.generate(this.state.queryProps);
		this._form.current.updateQuery(query);
		this.query(query);
	};

	/**
	 * @inheritdoc
	 */
	render() {
		return (
			<div className="App">
				<div className="App__form-container">
					<Form
						ref={this._form}
						{...this.props.defaultQueryProps}
						onChange={value => this.setState(
							{queryProps: Object.assign(this.state.queryProps, value)}
						)}
						onSubmit={this.updateChart} />
				</div>
				{this.state.data === null ? 'loading' : <Chart data={this.state.data} />}
			</div>
		);
	}
}

App.propTypes = {
	defaultQueryProps: PropTypes.object,
	query: PropTypes.string,
};

export default App;
