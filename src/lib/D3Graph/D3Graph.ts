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

type D3GraphState = Omit<GraphState, 'data'> & {
	data: {nodes: D3GraphNode[], links: D3GraphLink[]}
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

	/**
	 * Manages the tooltip shown when hovering a circle.
	 */
	private tooltipController: ReturnType<typeof createTooltipController>
	/**
	 * The SVG the data is rendered in.
	 */
	private svg: Selection<SVGSVGElement, unknown, null, undefined>
	/**
	 * Reference to the zoom.
	 */
	private zoom?: ZoomBehavior<SVGSVGElement, unknown>

	constructor(element: HTMLElement) {
		this.svg = d3.select<HTMLElement, unknown>(element).append('svg')
			.attr('class', 'D3Graph');
		this.tooltipController = createTooltipController();
	}

	update(state: GraphState) {

		// D3 will extend node and link object with properties. Therefore, clone the objects to prevent
		// D3 specifics leaking outside the class.
		const clonedState: D3GraphState = {
			...state,
			data: {
				nodes: state.data.nodes.map(node => ({...node})),
				links: state.data.links.map(link => ({...link})),
			},
		}

		this.svg.selectAll('*').remove();

		if (this.zoom) {
			this.svg
				.transition()
				.duration(800)
				.call(this.zoom.transform, d3.zoomIdentity);
		}

		this.draw(clonedState);

		this.tooltipController.hide();
	}

	private draw(state: D3GraphState) {
		const container = this.svg.append('g');

		this.zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', event => {
			this.onZoom(event, container);
		});

		this.svg
			.attr('width', state.width)
			.attr('height', state.height)
			.call(this.zoom)
			.call(this.tooltipController.tooltip);

		const graphNodes = calculateRadii(state.data.nodes);

		const simulation = this.createSimulation(graphNodes, state.data.links);

		const renderer = createRenderer(container);
		renderer.init(!graphNodes.some(graphNode => graphNode.radius === undefined));

		const links = renderer.renderLinks(state.data.links);

		const nodes = renderer.renderNodes(graphNodes, state.root)
			.call(attachNodeDragBehaviour(simulation));

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

		simulation?.on('tick', () => this.renderFrame({nodes, links, labels}));
	}

	private createSimulation(nodes: D3GraphNode[], links: D3GraphLink[]) {
		return d3.forceSimulation(nodes)
			.force('link', d3.forceLink<D3GraphNode, D3GraphLink>(links).id(d => d.id))
			.force('charge', d3.forceManyBody())
			.force('center', d3.forceCenter(
				(parseInt(this.svg.attr('width')) / 2) + 100, parseInt(this.svg.attr('height')) / 2)
			);
	}

	private onZoom(
		event: D3ZoomEvent<SVGSVGElement, unknown>,
		container: d3.Selection<SVGGElement, unknown, null, undefined>
	) {
		container.attr('transform', event.transform.toString());
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
