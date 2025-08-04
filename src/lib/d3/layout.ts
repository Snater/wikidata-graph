import type {D3ChartLink, D3ChartNode} from '@/lib/D3Chart/D3Chart';
import Vector from '@/lib/Vector';
import {scaleLinear} from 'd3';

type PositionedNode = {
	x?: number
	y?: number
	radius?: number
}

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

export function calculateLinkGeometry(link: D3ChartLink): {
	scaledSource: {x: number; y: number}
	scaledTarget: {x: number; y: number}
} {
	const source = link.source as PositionedNode;
	const target = link.target as PositionedNode;

	const sx = source.x ?? 0;
	const sy = source.y ?? 0;
	const tx = target.x ?? 0;
	const ty = target.y ?? 0;

	if (sx === tx && sy === ty) {
		return {
			scaledSource: { x: sx, y: sy },
			scaledTarget: { x: tx, y: ty },
		};
	}

	const sourcePoint = { x: sx, y: sy };
	const targetPoint = { x: tx, y: ty };

	const diff = Vector.diff(targetPoint, sourcePoint);

	const sourceRadius = source.radius ?? 0;
	const targetRadius = target.radius ?? 0;

	return {
		scaledSource: Vector.sum(
			sourcePoint,
			Vector.scale(diff, sourceRadius)
		),
		scaledTarget: Vector.diff(
			targetPoint,
			Vector.scale(diff, targetRadius)
		),
	};
}
