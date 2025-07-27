import * as d3 from 'd3';
import type {D3ChartLink, D3ChartNode} from '@/lib/D3Chart/D3Chart';

export function createRenderer(
	container: d3.Selection<SVGGElement, unknown, null, undefined>
) {

	function init(hasRadius: boolean) {
		container
			.append('defs')
			.append('marker')
			.attr('id', 'triangle')
			.attr('viewBox', '0 -5 10 10')
			.attr('refX', hasRadius ? '9' : '15')
			.attr('markerUnits', 'strokeWidth')
			.attr('markerWidth', '6')
			.attr('markerHeight', '6')
			.attr('orient', 'auto')
			.append('path')
			.attr('d', 'M 0 -5 L 10 0 L 0 5');
	}

	function renderNodes(nodes: D3ChartNode[], root: string) {
		return container
			.append('g')
			.selectAll<SVGCircleElement, D3ChartNode>('circle')
			.data(nodes)
			.join('circle')
			.attr('r', d => d.radius || 5)
			.attr('class', d => d.id === root ? 'root' : '');
	}

	function renderLinks(links: D3ChartLink[]) {
		return container
			.append('g')
			.selectAll<SVGLineElement, D3ChartLink>('line')
			.data(links)
			.join('line');
	}

	function renderLabels(nodes: D3ChartNode[]) {
		return container
			.append('g')
			.selectAll<SVGTextElement, D3ChartNode>('text')
			.data(nodes)
			.join('text')
			.attr('x', 8)
			.attr('y', '.31em')
			.text(d => d.label);
	}

	return {
		init,
		renderNodes,
		renderLinks,
		renderLabels,
	};
}