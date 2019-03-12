import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Chart from './Chart';
import Form from './Form';
import QueryStringManager from './QueryStringManager';
import SparqlGenerator from './SparqlGenerator';
import Wikidata from './WikidataInterface';
import './App.css';

class App extends Component {

	/**
	 * @inheritdoc
	 */
	constructor(props) {
		super(props);

		this.state = {
			queryProps: {
				item: this.props.defaultQueryProps.item,
				property: this.props.defaultQueryProps.property,
				mode: this.props.defaultQueryProps.mode,
				language: this.props.defaultQueryProps.language,
				iterations: this.props.defaultQueryProps.iterations,
				limit: this.props.defaultQueryProps.limit,
				sizeProperty: this.props.defaultQueryProps.sizeProperty || null,
			},
			sparqlQuery: '',
			data: null,
		};

		this.queryStringManager = new QueryStringManager(
			this.state.queryProps,
			queryProps => this.setState({
				queryProps: Object.assign(queryProps),
			})
		);
	}

	/**
	 * @inheritdoc
	 */
	componentDidMount() {
		this.setState({
			sparqlQuery: SparqlGenerator.generate(this.state.queryProps)
		});
	}

	/**
	 * @param {string} sparqlQuery
	 * @return {Promise<Object[]>}
	 */
	query(sparqlQuery) {
		return Wikidata.sparqlQuery(sparqlQuery).then(data => {
			if (data) {
				this.setState({data: data});
			}
		});
	}

	/**
	 * @inheritdoc
	 */
	componentDidUpdate(prevProps, prevState) {
		const sparqlQuery = SparqlGenerator.generate(this.state.queryProps);

		if (sparqlQuery !== this.state.sparqlQuery) {
			this.setState({sparqlQuery: sparqlQuery});
		} else if (prevState.sparqlQuery !== this.state.sparqlQuery) {
			this.query(this.state.sparqlQuery)
				.then(
					() => this.queryStringManager.updateQueryString(this.state.queryProps)
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
					<Form
						queryProps={this.state.queryProps}
						onChange={value => this.setState(
							{queryProps: Object.assign({}, this.state.queryProps, value)}
						)}
						sparqlQuery={this.state.sparqlQuery}
					/>
				</div>
				{
					this.state.data === null
						? 'loading'
						: <Chart
								data={this.state.data}
								root={this.state.queryProps.item}
								getEntityImage={Wikidata.getEntityImage}
							/>
				}
			</div>
		);
	}
}

App.propTypes = {
	defaultQueryProps: PropTypes.shape({
		item: PropTypes.string,
		property: PropTypes.string,
		mode: PropTypes.string,
		language: PropTypes.string,
		iterations: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		sizeProperty: PropTypes.string,
	}),
};

export default App;
