import './D3Graph.css';
import * as d3 from 'd3';
import type {D3GraphLink, D3GraphNode} from '@/lib/D3Graph/types';
import {D3ZoomEvent, Selection, ZoomBehavior} from 'd3';
import {GraphLink, GraphNode} from '@/lib/graph/types';
import {D3Renderer} from '@/lib/d3/D3Renderer';
import type {EntityId} from 'wikibase-sdk';
import {calculateRadii} from '@/lib/d3/layout';
import {createTooltipController} from '@/lib/d3/tooltip';
import {attachLabelInteractions, attachNodeDragBehaviour, attachNodeInteractions} from '@/lib/d3/interactions';

type GraphState = {
	data: {nodes: GraphNode[], links: GraphLink[]}
	root: EntityId
	height: number
	width: number
}

class D3Graph {

	private svg: Selection<SVGSVGElement, unknown, null, undefined>
	private container: Selection<SVGGElement, unknown, null, undefined>
	private readonly simulation: d3.Simulation<D3GraphNode, D3GraphLink>
	private readonly tooltipController: ReturnType<typeof createTooltipController>
	private zoom: ZoomBehavior<SVGSVGElement, unknown>
	private renderer: D3Renderer
	private dimensions: {width: number, height: number} | undefined

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
			.force('charge', d3.forceManyBody())
			.on('tick', () => {
				this.renderer.renderFrame();
			});

		this.renderer = new D3Renderer(this.container);
	}

	update(state: GraphState) {
		const nodes = calculateRadii(state.data.nodes.map(n => ({...n})));

		this.renderer.updateDefs(!nodes.some(node => node.radius === undefined));

		const links = state.data.links.map(l => ({...l}));

		this.svg
			.attr('width', state.width)
			.attr('height', state.height);

		this.updateSimulation(nodes, links);

		if (state.width !== this.dimensions?.width || state.height !== this.dimensions?.height) {
			this.dimensions = {width: state.width, height: state.height};
			this.updateCenterForce(state.width, state.height);
		}

		const view = this.renderer.update(nodes, links, state.root);

		attachNodeDragBehaviour(this.simulation)(view.nodes);

		attachNodeInteractions(view.nodes, {
			showTooltip: this.tooltipController.show,
			hideTooltip: this.tooltipController.hide,
		});

		attachLabelInteractions(view.labels, {
			nodes: view.nodes,
			showTooltip: this.tooltipController.show,
			hideTooltip: this.tooltipController.hide,
		});

		this.simulation.alpha(1).restart();
	}

	private updateSimulation(nodes: D3GraphNode[], links: D3GraphLink[]) {
		this.simulation.nodes(nodes);

		const linkForce = this.simulation.force<d3.ForceLink<D3GraphNode, D3GraphLink>>('link');
		linkForce?.links(links);

		this.simulation.alpha(1).restart();
	}

	private updateCenterForce(width: number, height: number) {
		this.simulation.force('center', d3.forceCenter(width / 2, height / 2));
	}

	private onZoom(event: D3ZoomEvent<SVGSVGElement, unknown>) {
		this.container.attr('transform', event.transform.toString());
	}
}

export default D3Graph;
