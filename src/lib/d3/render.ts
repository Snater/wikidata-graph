import {D3GraphLink, D3GraphNode} from '@/lib/D3Graph/types';
import {Selection} from 'd3';

type RendererLayers = {
	nodesLayer: Selection<SVGGElement, unknown, null, undefined>
	linksLayer: Selection<SVGGElement, unknown, null, undefined>
	labelsLayer: Selection<SVGGElement, unknown, null, undefined>
}

export function createRenderer({
	nodesLayer,
	linksLayer,
	labelsLayer,
}: RendererLayers) {

	function init(hasRadius: boolean) {

		const defs = nodesLayer
			.selectAll<SVGDefsElement, unknown>('defs')
			.data([null])
			.join('defs');

		defs
			.selectAll<SVGMarkerElement, unknown>('marker')
			.data([null])
			.join('marker')
			.attr('id', 'triangle')
			.attr('viewBox', '0 -5 10 10')
			.attr('refX', hasRadius ? '9' : '15')
			.attr('markerUnits', 'strokeWidth')
			.attr('markerWidth', '6')
			.attr('markerHeight', '6')
			.attr('orient', 'auto')
			.selectAll('path')
			.data([null])
			.join('path')
			.attr('d', 'M 0 -5 L 10 0 L 0 5');
	}

	function renderNodes(nodes: D3GraphNode[], root: string) {
		return nodesLayer
			.selectAll<SVGCircleElement, D3GraphNode>('circle')
			.data(nodes, node => node.id)
			.join(
				enter => enter.append('circle'),
				update => update,
				exit => exit.remove()
			)
			.attr('r', node => node.radius || 5)
			.attr('class', node =>
				node.id === root ? 'root' : ''
			);
	}

	function renderLinks(links: D3GraphLink[]) {
		return linksLayer
			.selectAll<SVGLineElement, D3GraphLink>('line')
			.data(
				links,
				link => `${link.source}-${link.target}`
			)
			.join(
				enter => enter.append('line'),
				update => update,
				exit => exit.remove()
			);
	}

	function renderLabels(nodes: D3GraphNode[]) {
		return labelsLayer
			.selectAll<SVGTextElement, D3GraphNode>('text')
			.data(nodes, node => node.id)
			.join(
				enter => enter.append('text'),
				update => update,
				exit => exit.remove()
			)
			.attr('x', 8)
			.attr('y', '.31em')
			.text(node => node.label);
	}

	return {
		init,
		renderNodes,
		renderLinks,
		renderLabels,
	};
}