import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';
import D3Chart from '../../lib/D3Chart';
import styles from './Chart.module.css';

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
		this.d3Chart = new D3Chart(
			ReactDom.findDOMNode(this),
			this.props.getEntityImage
		);

		if (this.props.data !== null) {
			this.d3Chart.update(this.getChartState());
		}

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
		const chartClass = this.props.data === null
			? classNames({}, styles.Chart, styles.loading) : styles.Chart;

		return (
			<div className={chartClass} />
		);
	}
}

Chart.propTypes = {
	data: PropTypes.object,
	root: PropTypes.string,
	getEntityImage: PropTypes.func,
};

export default Chart;
