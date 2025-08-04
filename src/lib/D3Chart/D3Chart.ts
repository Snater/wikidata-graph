import './D3Chart.css';
import * as d3 from 'd3';
import {
	D3ZoomEvent,
	Selection,
	SimulationLinkDatum,
	SimulationNodeDatum,
	ZoomBehavior
} from 'd3';
import type {Link, Node} from '@/lib/graph/types';
import Vector, {Point} from '../Vector';
import {
	attachLabelInteractions,
	attachNodeDragBehaviour,
	attachNodeInteractions,
} from '@/lib/d3/interactions';
import {EntityId} from 'wikibase-sdk';
import {calculateLinkGeometry, calculateRadii} from '@/lib/d3/layout';
import {createRenderer} from '@/lib/d3/render';
import {createTooltipController} from '@/lib/d3/tooltip';

type ChartState = {
	data: {nodes: Node[], links: Link[]}
	root: EntityId
	height: number
	width: number
}

export type D3ChartNode = Node & SimulationNodeDatum & {
	radius?: number
}

export type D3ChartLink = SimulationLinkDatum<D3ChartNode> & {
	scaledSource?: Point
	scaledTarget?: Point
}

type D3ChartState = Omit<ChartState, 'data'> & {
	data: {nodes: D3ChartNode[], links: D3ChartLink[]}
}

class D3Chart {

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
			.attr('class', 'D3Chart');
		this.tooltipController = createTooltipController();
	}

	update(state: ChartState) {

		// D3 will extend node and link object with properties. Therefore, clone the objects to prevent
		// D3 specifics leaking outside the class.
		const clonedState: D3ChartState = {
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

	private draw(state: D3ChartState) {
		const container = this.svg.append('g');

		this.zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', event => {
			this.onZoom(event, container);
		});

		this.svg
			.attr('width', state.width)
			.attr('height', state.height)
			.call(this.zoom)
			.call(this.tooltipController.tooltip);

		const nodes = calculateRadii(state.data.nodes);

		const simulation = this.createSimulation(nodes, state.data.links);

		const renderer = createRenderer(container);
		renderer.init(!nodes.some(node => node.radius === undefined));

		const links = renderer.renderLinks(state.data.links);

		const circles = renderer.renderNodes(nodes, state.root)
			.call(attachNodeDragBehaviour(simulation));

		attachNodeInteractions(circles, {
			hideTooltip: this.tooltipController.hide,
			showTooltip: this.tooltipController.show,
		});

		const labels = renderer.renderLabels(nodes);

		attachLabelInteractions(labels, {
			circles: circles,
			hideTooltip: this.tooltipController.hide,
			showTooltip: this.tooltipController.show,
		});

		simulation?.on('tick', () => {
			circles && links && labels && this.onTick(circles, links, labels);
		});
	}

	private createSimulation(nodes: D3ChartNode[], links: D3ChartLink[]) {
		return d3.forceSimulation(nodes)
			.force('link', d3.forceLink<D3ChartNode, D3ChartLink>(links).id(d => d.id))
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

	private onTick(
		nodes: Selection<SVGCircleElement, D3ChartNode, SVGElement, undefined>,
		links: Selection<SVGLineElement, D3ChartLink, SVGGElement, unknown>,
		labels: Selection<SVGTextElement, D3ChartNode, SVGGElement, unknown>
	) {
		nodes
			.attr('cx', d => d.x ?? 0)
			.attr('cy', d => d.y ?? 0);

		const radius = nodes.filter(':first-child').datum().radius;
		this.calculateLine(links, !!radius && radius > 0);

		labels.attr('transform', d => `translate(${d.x},${d.y})`);

		if (this.tooltipController.tooltip.style('opacity') === '1') {
			// Reset tooltip position:
			this.tooltipController.tooltip.hide().show();
		}
	}

	private calculateLine(
		links: Selection<SVGLineElement, D3ChartLink, SVGGElement, unknown>,
		hasSize = false
	) {
		if (!hasSize) {
			links
				.attr('x1', d => (typeof d.source === 'object' && 'x' in d.source && d.source.x) ?? 0)
				.attr('y1', d => (typeof d.source === 'object' && 'y' in d.source && d.source.y) ?? 0)
				.attr('x2', d => (typeof d.target === 'object' && 'x' in d.target && d.target.x) ?? 0)
				.attr('y2', d => (typeof d.target === 'object' && 'y' in d.target && d.target.y) ?? 0);

			return;
		}

		links.each(link => {
			const geom = calculateLinkGeometry(link);

			link.scaledSource = geom.scaledSource;
			link.scaledTarget = geom.scaledTarget;
		})
			.attr('x1', ({scaledSource}) => scaledSource?.x ?? 0)
			.attr('y1', ({scaledSource}) => scaledSource?.y ?? 0)
			.attr('x2', ({scaledTarget}) => scaledTarget?.x ?? 0)
			.attr('y2', ({scaledTarget}) => scaledTarget?.y ?? 0);
	}
}

export default D3Chart;
