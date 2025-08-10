'use client'

import React, {useCallback, useEffect, useRef, useState} from 'react';
import useQueryContext from '../App/QueryContext';
import Box from '@mui/material/Box';
import D3Graph from '@/lib/D3Graph/D3Graph';

let d3Graph: D3Graph;

export default function Graph() {
	const [width, setWidth] = useState<number>();
	const [height, setHeight] = useState<number>();
	const {result} = useQueryContext();
	const canvas = useRef<HTMLDivElement>(null);

	const updateDimensions = useCallback(() => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	}, []);

	if (canvas.current && !d3Graph) {
		d3Graph = new D3Graph(canvas.current);
		window.addEventListener('resize', updateDimensions);
	}

	useEffect(() => {
		updateDimensions();
	}, [updateDimensions]);

	useEffect(() => {
		if (d3Graph && result && width && height) {
			d3Graph.update({
				data: result,
				root: result.root,
				height,
				width,
			});
		}
	}, [result, height, width]);

	return (
		<Box
			height="100vH"
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
