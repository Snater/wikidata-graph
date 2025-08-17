import type {D3GraphLink, D3GraphNode} from '@/lib/D3Graph/types';
import type {Selection} from 'd3';
import {calculateLinkGeometry} from '@/lib/d3/layout';

type NodesSelection = Selection<SVGCircleElement, D3GraphNode, SVGGElement, unknown>
type LinksSelection = Selection<SVGLineElement, D3GraphLink, SVGGElement, unknown>
type LabelsSelection = Selection<SVGTextElement, D3GraphNode, SVGGElement, unknown>

export class D3Renderer {

	private container: Selection<SVGGElement, unknown, null, undefined>
	private nodesSel: NodesSelection
	private linksSel: LinksSelection
	private labelsSel: LabelsSelection

	constructor(container: Selection<SVGGElement, unknown, null, undefined>) {
		this.container = container;

		this.nodesSel = container.append('g')
			.selectAll<SVGCircleElement, D3GraphNode>('circle')
			.data<D3GraphNode>([], d => d.id)
			.join('circle');

		this.linksSel = container.append('g')
			.selectAll<SVGLineElement, D3GraphLink>('line')
			.data<D3GraphLink>([], d => d.id)
			.join('line');

		this.labelsSel = container.append('g')
			.selectAll<SVGTextElement, D3GraphNode>('text')
			.data<D3GraphNode>([], d => d.id)
			.join('text');
	}

	updateDefs(hasRadius: boolean) {
		this.container
			.selectAll('defs')
			.data([null])
			.join('defs')
			.append('marker')
			.attr('id', 'triangle')
			.attr('viewBox', '0 -5 10 10')
			.attr('refX', hasRadius ? '9' : '15')
			.attr('markerWidth', 6)
			.attr('markerHeight', 6)
			.attr('orient', 'auto')
			.append('path')
			.attr('d', 'M 0 -5 L 10 0 L 0 5');
	}

	update(nodes: D3GraphNode[], links: D3GraphLink[], root: string) {
		this.nodesSel = this.container
			.selectAll<SVGCircleElement, D3GraphNode>('circle')
			.data(nodes, d => d.id)
			.join('circle')
			.attr('r', d => d.radius ?? 5)
			.attr('class', d => d.id === root ? 'root' : '');

		this.linksSel = this.container
			.selectAll<SVGLineElement, D3GraphLink>('line')
			.data(links, d => d.id)
			.join('line');

		this.labelsSel = this.container
			.selectAll<SVGTextElement, D3GraphNode>('text')
			.data(nodes, d => d.id)
			.join('text')
			.text(d => d.label);

		return {
			nodes: this.nodesSel,
			links: this.linksSel,
			labels: this.labelsSel,
		};
	}

	renderFrame() {
		this.nodesSel
			.attr('cx', d => d.x ?? 0)
			.attr('cy', d => d.y ?? 0);

		this.linksSel.each(l => {
			const { scaledSource, scaledTarget } = calculateLinkGeometry(l);
			l.scaledSource = scaledSource;
			l.scaledTarget = scaledTarget;
		});

		this.linksSel
			.attr('x1', d => d.scaledSource?.x ?? 0)
			.attr('y1', d => d.scaledSource?.y ?? 0)
			.attr('x2', d => d.scaledTarget?.x ?? 0)
			.attr('y2', d => d.scaledTarget?.y ?? 0);

		this.labelsSel
			.attr('transform', d => `translate(${d.x},${d.y})`);
	}
}