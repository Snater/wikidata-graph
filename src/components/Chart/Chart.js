import PropTypes from 'prop-types';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import D3Chart from '../../lib/D3Chart';
import styles from './Chart.module.css';
import useQueryContext from "../App/QueryContext";

export default function Chart({getEntityImage}) {

	const [width, setWidth] = useState(window.innerWidth);
	const [height, setHeight] = useState(window.innerHeight);
	const [d3Chart, setD3Chart] = useState(null);
	const {result, query} = useQueryContext();
	const canvas = useRef(null);

	const updateDimensions = useCallback(() => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	}, [setHeight, setWidth]);

	useEffect(() => {
		setD3Chart(new D3Chart(canvas.current, getEntityImage));

		window.addEventListener('resize', updateDimensions);

		return () => {
			window.removeEventListener('resize', updateDimensions);
		}
	}, [getEntityImage, updateDimensions]);

	useEffect(() => {
		if (d3Chart && query && result && width && height) {
			d3Chart.update({
				data: result,
				root: query.getItem(),
				height,
				width,
			});
		}
	}, [d3Chart, result, height, query, width]);

	const chartClass = result	? styles.Chart : classNames({}, styles.Chart, styles.loading);

	return <div className={chartClass} ref={canvas} />;
}

Chart.propTypes = {
	getEntityImage: PropTypes.func,
};

