'use client'

import React, {useEffect, useRef, useState} from 'react';
import useQueryContext from '../App/QueryContext';
import Box from '@mui/material/Box';
import D3Graph from '@/lib/D3Graph/D3Graph';

export default function Graph() {
	const [width, setWidth] = useState<number>();
	const [height, setHeight] = useState<number>();
	const {result} = useQueryContext();
	const canvas = useRef<HTMLDivElement>(null);
	const graphRef = useRef<D3Graph | null>(null);

	useEffect(() => {
		if (!canvas.current) {
			return;
		}

		graphRef.current = new D3Graph(canvas.current);

		const onResize = () => {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
		};

		window.addEventListener('resize', onResize);
		onResize();

		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, []);

	useEffect(() => {
		if (!graphRef.current || !result || !width || !height) {
			return;
		}

		graphRef.current.update({
			data: result,
			root: result.root,
			height,
			width,
		});
	}, [result, width, height]);

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
