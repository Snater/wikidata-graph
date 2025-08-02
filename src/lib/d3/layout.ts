import type {D3ChartNode} from '@/lib/D3Chart/D3Chart';
import {scaleLinear} from 'd3';

export function calculateRadii(nodes: D3ChartNode[]): D3ChartNode[] {

	const uniqueSizes = [...new Set(nodes.map(node => node.size))];

	if (uniqueSizes.length < 1) {
		return nodes;
	}

	const maxSize = Math.max(...nodes.map(n => n.size));
	const minSize = Math.min(...nodes.map(n => n.size));

	const scale = scaleLinear()
		.domain([minSize, maxSize])
		.range([3, 20]);

	return nodes.map(node => ({
		...node,
		radius: scale(node.size),
	}));
}
