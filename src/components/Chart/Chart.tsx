'use client'

import React, {useCallback, useEffect, useRef, useState} from 'react';
import D3Chart from '../../lib/D3Chart';
import useQueryContext from '../App/QueryContext';
import Box from '@mui/material/Box';
import WikidataInterface from '@/lib/WikidataInterface';

let d3Chart: D3Chart;

export default function Chart() {
	const [width, setWidth] = useState<number>();
	const [height, setHeight] = useState<number>();
	const {result} = useQueryContext();
	const canvas = useRef<HTMLDivElement>(null);

	const updateDimensions = useCallback(() => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	}, []);

	if (canvas.current && !d3Chart) {
		d3Chart = new D3Chart(canvas.current, WikidataInterface.getEntityImage);
		window.addEventListener('resize', updateDimensions);
	}

	useEffect(() => {
		updateDimensions();
	}, [updateDimensions]);

	useEffect(() => {
		if (d3Chart && result && width && height) {
			d3Chart.update({
				data: result,
				root: result.root,
				height,
				width,
			});
		}
	}, [result, height, width]);

	return (
		<Box
			ref={canvas}
			width={1}
			{...result ? {} : {
				':after': {
					content: 'loading…',
					display: 'block',
					mt: 12,
					textAlign: 'center',
				},
				svg: {
					display: 'none',
				},
			}}
		/>
	);
}
