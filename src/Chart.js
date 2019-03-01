import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import D3Chart from './D3Chart';
import './Chart.css';

class Chart extends Component {

	/**
	 * @inheritdoc
	 */
	constructor(props) {
		super(props);

		this.state = {
			width: window.innerWidth,
			height: window.innerHeight,
		}
	}

	/**
	 * @inheritdoc
	 */
	componentDidMount() {
		this.d3Chart = new D3Chart(ReactDom.findDOMNode(this));
		this.d3Chart.create(this.getChartState());

		window.addEventListener('resize', this.updateDimensions);
	}

	/**
	 * @inheritdoc
	 */
	componentDidUpdate() {
		this.d3Chart.update(this.getChartState());
	}

	/**
	 * @return {Object}
	 */
	getChartState() {
		return {
			data: this.props.data,
			root: this.props.root,
			width: this.state.width,
			height: this.state.height,
		};
	}

	/**
	 * @inheritdoc
	 */
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions);
	}

	/**
	 * @inheritdoc
	 */
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.data !== this.props.data
			|| nextState.width !== this.state.width
			|| nextState.height !== this.state.height;
	}

	updateDimensions = () => {
		this.setState({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	};

	/**
	 * @inheritdoc
	 */
	render() {
		return (
			<div className="Chart"></div>
		);
	}
}

Chart.propTypes = {
	data: PropTypes.object,
	root: PropTypes.string,
};

export default Chart;
