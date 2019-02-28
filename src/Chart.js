import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import D3Chart from './D3Chart';
import './Chart.css';

class Chart extends Component {

	constructor(props) {
		super(props);

		this.state = {
			width: window.innerWidth,
			height: window.innerHeight,
		}
	}

	componentDidMount() {
		this.d3Chart = new D3Chart(ReactDom.findDOMNode(this));
		this.d3Chart.create(this.getChartState());

		window.addEventListener('resize', this.updateDimensions);
	}

	componentDidUpdate() {
		this.d3Chart.update(this.getChartState());
	}

	/**
	 * @return {Object}
	 */
	getChartState() {
		return {
			data: this.props.data,
			width: this.state.width,
			height: this.state.height,
		};
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
	}

	updateDimensions = () => {
		this.setState({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	};

	render() {
		return (
			<div className="Chart"></div>
		);
	}
}

Chart.propTypes = {
	data: PropTypes.array,
};

export default Chart;
