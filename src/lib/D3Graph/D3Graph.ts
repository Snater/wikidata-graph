import './D3Graph.css';
import * as d3 from 'd3';
import type {D3GraphLink, D3GraphNode} from '@/lib/D3Graph/types';
import {D3ZoomEvent, Selection, ZoomBehavior} from 'd3';
import {GraphLink, GraphNode} from '@/lib/graph/types';
import {
	attachLabelInteractions,
	attachNodeDragBehaviour,
	attachNodeInteractions,
} from '@/lib/d3/interactions';
import {calculateLinkGeometry, calculateRadii} from '@/lib/d3/layout';
import type {EntityId} from 'wikibase-sdk';
import {createRenderer} from '@/lib/d3/render';
import {createTooltipController} from '@/lib/d3/tooltip';

type GraphState = {
	data: {nodes: GraphNode[], links: GraphLink[]}
	root: EntityId
	height: number
	width: number
}

type NodesSelection = Selection<SVGCircleElement, D3GraphNode, SVGElement, undefined>
type LinksSelection = Selection<SVGLineElement, D3GraphLink, SVGGElement, unknown>
type LabelsSelection = Selection<SVGTextElement, D3GraphNode, SVGGElement, unknown>

type View = {
	nodes: NodesSelection
	links: LinksSelection
	labels: LabelsSelection
}

class D3Graph {

	private svg: Selection<SVGSVGElement, unknown, null, undefined>
	private readonly container: Selection<SVGGElement, unknown, null, undefined>
	private readonly simulation: d3.Simulation<D3GraphNode, D3GraphLink>
	private tooltipController: ReturnType<typeof createTooltipController>
	private zoom: ZoomBehavior<SVGSVGElement, unknown>

	constructor(element: HTMLElement) {
		this.svg = d3.select<HTMLElement, unknown>(element)
			.append('svg')
			.attr('class', 'D3Graph');

		this.container = this.svg.append('g');

		this.tooltipController = createTooltipController();

		this.zoom = d3.zoom<SVGSVGElement, unknown>()
			.on('zoom', event => this.onZoom(event));

		this.svg
			.call(this.zoom)
			.call(this.tooltipController.tooltip);

		this.simulation = d3.forceSimulation<D3GraphNode>()
			.force(
				'link',
				d3.forceLink<D3GraphNode, D3GraphLink>()
					.id(node => node.id)
			)
			.force('charge', d3.forceManyBody());
	}

	update(state: GraphState) {
		const graphNodes = calculateRadii(state.data.nodes.map(node => ({ ...node })));
		const graphLinks: D3GraphLink[] = state.data.links.map(link => ({...link,}));

		this.svg
			.attr('width', state.width)
			.attr('height', state.height);

		this.updateSimulation(graphNodes, graphLinks, state.width, state.height);

		const renderer = createRenderer(this.container);

		renderer.init(!graphNodes.some(node => node.radius === undefined));

		const links = renderer.renderLinks(graphLinks);

		const nodes = renderer
			.renderNodes(graphNodes, state.root)
			.call(attachNodeDragBehaviour(this.simulation));

		attachNodeInteractions(nodes, {
			hideTooltip: this.tooltipController.hide,
			showTooltip: this.tooltipController.show,
		});

		const labels = renderer.renderLabels(graphNodes);

		attachLabelInteractions(labels, {
			nodes,
			hideTooltip: this.tooltipController.hide,
			showTooltip: this.tooltipController.show,
		});

		this.simulation.on('tick', () => {
			this.renderFrame({nodes, links, labels});
		});

		this.tooltipController.hide();
	}

	private updateSimulation(
		nodes: D3GraphNode[],
		links: D3GraphLink[],
		width: number,
		height: number
	) {
		this.simulation.nodes(nodes);

		const linkForce = this.simulation.force<d3.ForceLink<D3GraphNode, D3GraphLink>>('link');

		linkForce?.links(links);

		this.simulation.force(
			'center',
			d3.forceCenter((width / 2) + 100, height / 2)
		);

		this.simulation.alpha(1).restart();
	}

	private onZoom(event: D3ZoomEvent<SVGSVGElement, unknown>) {
		this.container.attr('transform', event.transform.toString());
		this.tooltipController.hide();
	}

	private renderFrame(view: View) {
		view.nodes
			.attr('cx', node => node.x ?? 0)
			.attr('cy', node => node.y ?? 0);

		view.links.each(link => {
			const { scaledSource, scaledTarget } = calculateLinkGeometry(link);
			link.scaledSource = scaledSource;
			link.scaledTarget = scaledTarget;
		});

		view.links
			.attr('x1', node => node.scaledSource?.x ?? 0)
			.attr('y1', node => node.scaledSource?.y ?? 0)
			.attr('x2', node => node.scaledTarget?.x ?? 0)
			.attr('y2', node => node.scaledTarget?.y ?? 0);

		view.labels
			.attr('transform', d => `translate(${d.x},${d.y})`);
	}
}

export default D3Graph;
