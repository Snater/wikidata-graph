import './D3Graph.css';
import * as d3 from 'd3';
import type {D3GraphLink, D3GraphNode} from '@/lib/D3Graph/types';
import {D3ZoomEvent, Selection, ZoomBehavior} from 'd3';
import {GraphLink, GraphNode} from '@/lib/graph/types';
import {attachLabelInteractions, attachNodeDragBehaviour, attachNodeInteractions} from '@/lib/d3/interactions';
import {D3Renderer} from '@/lib/d3/D3Renderer';
import type {EntityId} from 'wikibase-sdk';
import {calculateRadii} from '@/lib/d3/layout';
import {createTooltipController} from '@/lib/d3/tooltip';

type GraphState = {
	data: {nodes: GraphNode[], links: GraphLink[]}
	root: EntityId
	height: number
	width: number
}

type TopologySignature = {
	nodes: Set<string>
	links: Set<string>
}

class D3Graph {

	private svg: Selection<SVGSVGElement, unknown, null, undefined>
	private readonly container: Selection<SVGGElement, unknown, null, undefined>
	private readonly simulation: d3.Simulation<D3GraphNode, D3GraphLink>
	private readonly tooltipController: ReturnType<typeof createTooltipController>
	private zoom: ZoomBehavior<SVGSVGElement, unknown>
	private renderer: D3Renderer
	private dimensions: {width: number, height: number} | undefined
	private restartReason: 'none' | 'layout' | 'topology' = 'none'
	private prevTopologySignature?: TopologySignature

	constructor(element: HTMLElement) {
		this.svg = d3.select(element)
			.append('svg')
			.attr('class', 'D3Graph');

		this.container = this.svg.append('g');

		this.tooltipController = createTooltipController();

		this.zoom = d3.zoom<SVGSVGElement, unknown>()
			.on('zoom', this.onZoom);

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
		const links = state.data.links.map(l => ({...l}));

		this.renderer.updateDefs(!nodes.some(node => node.radius === undefined));

		this.svg
			.attr('width', state.width)
			.attr('height', state.height);

		this.updateDimensions(state.width, state.height);

		this.syncSimulation(nodes, links);

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

		if (this.restartReason !== 'none') {
			this.simulation.alpha(this.restartReason === 'layout' ? 0.1 : 1).restart();
			this.restartReason = 'none';
		}
	}

	private syncSimulation(nodes: D3GraphNode[], links: D3GraphLink[]) {
		const topologySignature = this.topologySignature(nodes, links);

		if (
			!this.prevTopologySignature
			|| !this.topologySignatureEquals(this.prevTopologySignature, topologySignature)
		) {
			this.requestRestart('topology');
		}

		this.prevTopologySignature = topologySignature;

		this.simulation.nodes(nodes);

		const linkForce = this.simulation.force<d3.ForceLink<D3GraphNode, D3GraphLink>>('link');
		linkForce?.links(links);
	}

	private updateDimensions(width: number, height: number) {
		if (this.dimensions?.width === width && this.dimensions?.height === height) {
			return;
		}

		this.dimensions = {width, height};

		this.simulation.force('center', d3.forceCenter((width / 2) + 100, height / 2));

		this.requestRestart('layout');
	}

	private onZoom(event: D3ZoomEvent<SVGSVGElement, unknown>) {
		this.container.attr('transform', event.transform.toString());
	}

	private requestRestart(reason: 'layout' | 'topology') {
		if (this.restartReason === 'topology') {
			return;
		}

		if (reason === 'topology') {
			this.restartReason = 'topology';
			return;
		}

		if (this.restartReason === 'none') {
			this.restartReason = 'layout';
		}
	}

	private topologySignature(nodes: D3GraphNode[], links: D3GraphLink[]) {
		return {
			nodes: this.nodeIdsToKeySet(nodes),
			links: this.linksToKeySet(links),
		};
	}

	private nodeIdsToKeySet(nodes: D3GraphNode[]){
		return new Set(nodes.map(n => n.id));
	}

	private linksToKeySet(links: D3GraphLink[]) {
		return new Set(
			links.map(l => {
				const source = typeof l.source === 'object' ? l.source.id : l.source;
				const target = typeof l.target === 'object' ? l.target.id : l.target;
				return `${source}->${target}`;
			})
		);
	}

	private topologySignatureEquals(a: TopologySignature, b: TopologySignature) {
		return this.setEquals(a.nodes, b.nodes) && this.setEquals(a.links, b.links);
	}

	private setEquals(a: Set<string>, b: Set<string>) {
		if (a.size !== b.size) return false;

		for (const value of a) {
			if (!b.has(value)) return false;
		}

		return true;
	}
}

export default D3Graph;
