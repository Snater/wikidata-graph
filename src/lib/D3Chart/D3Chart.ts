import './D3Chart.css';
import * as d3 from 'd3';
import {
	D3DragEvent,
	D3ZoomEvent,
	Selection,
	SimulationLinkDatum,
	SimulationNodeDatum,
	ZoomBehavior
} from 'd3';
import {Link, Node} from '../WikidataInterface/WikidataInterface';
import Vector, {Point} from '../Vector';
import {EntityId} from 'wikibase-sdk';
import {Simulation} from 'd3-force';
import {tip} from 'd3-v6-tip';

type ChartState = {
	data: {nodes: Node[], links: Link[]}
	root: EntityId
	height: number
	width: number
}

type D3ChartNode = Node & SimulationNodeDatum & {
	radius?: number
}

type D3ChartLink = SimulationLinkDatum<D3ChartNode> & {
	scaledSource?: Point
	scaledTarget?: Point
}

type D3ChartState = Omit<ChartState, 'data'> & {
	data: {nodes: D3ChartNode[], links: D3ChartLink[]}
}

class D3Chart {

	/**
	 * Tooltip shown when hovering a circle.
	 */
	private readonly tooltip: ReturnType<typeof tip>
	/**
	 * Rendered circles, one for each unique data node.
	 */
	private circles?: Selection<SVGCircleElement, Node & {radius?: number}, SVGGElement, undefined>
	/**
	 * Container within the SVG element, wrapping the rendered element groups.
	 */
	private container?: Selection<SVGGElement, unknown, null, undefined>
	/**
	 * Callback for retrieving the image corresponding to an entity.
	 */
	private getEntityImage: (id: EntityId) => Promise<HTMLImageElement>
	/**
	 * Rendered labels, once for each unique data node.
	 */
	private labels?: Selection<SVGTextElement, Node, SVGGElement, unknown>
	/**
	 * The SVG the data is rendered in.
	 */
	private svg: Selection<SVGSVGElement, unknown, null, undefined>
	/**
	 * Reference to the rendered force simulation.
	 */
	private simulation?: Simulation<D3ChartNode, undefined>
	/**
	 * Reference to the zoom.
	 */
	private zoom?: ZoomBehavior<SVGSVGElement, unknown>

	constructor(element: HTMLElement, getEntityImage: (id: EntityId) => Promise<HTMLImageElement>) {
		this.svg = d3.select<HTMLElement, unknown>(element).append('svg')
			.attr('class', 'D3Chart');
		this.getEntityImage = getEntityImage;
		this.tooltip = this.createTooltip();
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

		this.tooltip.hide();
	}

	private createTooltip() {
		return tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0]);
	}

	private draw(state: D3ChartState) {
		this.container = this.svg.append('g');
		this.zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', event => this.onZoom(event));

		this.svg
			.attr('width', state.width)
			.attr('height', state.height)
			.call(this.zoom)
			.call(this.tooltip);

		this.createSimulation(state.data);

		const nodes = this.calculateRadii(state.data.nodes);

		this.drawDefs(!!nodes[0].radius);

		const links = this.drawLinks(state.data.links);
		this.circles = this.drawNodes(nodes, state.root);
		this.labels = this.drawLabels(nodes);

		this.simulation?.on('tick', () => {
			this.circles && links && this.labels && this.onTick(this.circles, links, this.labels);
		});
	}

	private calculateRadii(nodes: D3ChartNode[]) {
		const sizes = nodes.map(node => node.size);
		const uniqueSizes = sizes.filter(
			(size, index, self) => self.indexOf(size) === index
		);

		if (uniqueSizes.length < 1) {
			return nodes;
		}

		const maxSize = nodes.reduce((max, node) => !max || node.size > max.size ? node : max).size;
		const minSize = nodes.reduce((min, node) => !min || node.size < min.size ? node : min).size;
		const scaleRange = [3, 20];
		const scale = d3.scaleLinear().domain([minSize, maxSize]).range(scaleRange);

		return nodes.map(node => Object.assign(node, {radius: scale(node.size)}));
	}

	private drawDefs(hasRadius: boolean) {
		this.svg.append('defs').append('marker')
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

	private createSimulation(data: D3ChartState['data']) {
		this.simulation = d3.forceSimulation(data.nodes)
			.force('link', d3.forceLink<D3ChartNode, D3ChartLink>(data.links).id(d => d.id))
			.force('charge', d3.forceManyBody())
			.force('center', d3.forceCenter(
				(parseInt(this.svg.attr('width')) / 2) + 100, parseInt(this.svg.attr('height')) / 2)
			);
	}

	private drawNodes(nodes: D3ChartNode[], root: ChartState['root']) {
		return this.container?.append('g')
			.selectAll<SVGCircleElement, unknown>('circle')
			.data(nodes)
			.join('circle')
			.attr('r', d => d.radius || 5)
			.attr('class', d => d.id === root ? 'root' : '')
			.call(this.attachDragHandlers())
			.on('mouseover', (event, d) => this.enterTooltip(d, event.srcElement))
			.on('mouseout', () => this.exitTooltip());
	}

	private drawLinks(links: D3ChartLink[]) {
		return this.container?.append('g')
			.selectAll<SVGLineElement, unknown>('line')
			.data(links)
			.join('line');
	}

	private drawLabels(nodes: D3ChartNode[]) {
		return this.container?.append('g')
			.selectAll('text')
			.data(nodes)
			.enter()
			.append('text')
			.attr('role', 'link')
			.attr('tabindex', '0')
			.attr('x', 8)
			.attr('y', '.31em')
			.text(d => d.label)
			.on('click', (_event, d) => window.open(d.uri))
			.on('keydown', (event, d) => {
				if (event.key === 'Enter') {
					window.open(d.uri);
				}
			})
			.on(
				'mouseover',
				(_event, d) => this.circles && d.index && this.enterTooltip(
					d,
					this.circles.filter(`:nth-child(${d.index + 1})`).node() ?? undefined
				)
			)
			.on('mouseout', () => this.exitTooltip());
	}

	private enterTooltip(d: D3ChartNode, circle?: SVGCircleElement) {
		if (!d.index || !circle) {
			return;
		}

		this.labels?.filter(`:not(:nth-child(${d.index + 1}))`).style('opacity', 0.3);

		this.getEntityImage(d.id)
			.then(img => {
				const dimensions = this.determineImageDimensions(img);
				this.tooltip.html(`<img alt="" src="${img.src}" height="${dimensions.height}" width="${dimensions.width}">`);
				this.tooltip.show(d, circle);
			})
			.catch(() => {
				this.tooltip.html('no image');
				this.tooltip.show(d, circle);
			});
	}

	private determineImageDimensions(img: HTMLImageElement) {
		const tempCanvas = document.createElement('div');
		tempCanvas.style.position = 'absolute';
		tempCanvas.style.left = '-999px';
		tempCanvas.style.top = '-999px';
		document.getElementsByTagName('body')[0].appendChild(tempCanvas);
		tempCanvas.appendChild(img);
		const dimensions = {height: tempCanvas.clientHeight, width: tempCanvas.clientWidth};
		tempCanvas.remove();
		return dimensions;
	}

	private exitTooltip() {
		this.tooltip.html('');
		this.tooltip.hide();
		this.labels?.style('opacity', 1);
	}

	private attachDragHandlers() {
		const dragStarted = (
			event: D3DragEvent<SVGCircleElement, D3ChartNode, D3ChartNode>,
			d: D3ChartNode
		) => {
			if (!event.active) {
				this.simulation?.alphaTarget(0.3).restart();
			}
			d.fx = d.x;
			d.fy = d.y;
		};

		const dragged = (
			event: D3DragEvent<SVGCircleElement, D3ChartNode, D3ChartNode>,
			d: D3ChartNode
		) => {
			d.fx = event.x;
			d.fy = event.y;
		};

		const dragEnded = (
			event: D3DragEvent<SVGCircleElement, D3ChartNode, D3ChartNode>,
			d: D3ChartNode
		) => {
			if (!event.active) {
				this.simulation?.alphaTarget(0);
			}
			d.fx = null;
			d.fy = null;
		};

		return d3.drag<SVGCircleElement, D3ChartNode>()
			.on('start', dragStarted)
			.on('drag', dragged)
			.on('end', dragEnded);
	}

	private onZoom(event: D3ZoomEvent<SVGSVGElement, unknown>) {
		this.container?.attr('transform', event.transform.toString());
		this.exitTooltip();
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

		if (this.tooltip.style('opacity') === '1') {
			// Reset tooltip position:
			this.tooltip.hide().show();
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

		links
			.each(d => {
				if (
					typeof d.source !== 'object' || !('x' in d.source && 'y' in d.source)
					|| typeof d.target !== 'object' || !('x' in d.target && 'y' in d.target)
				) {
					return;
				}

				const sourcePoint = {x: d.source.x ?? 0, y: d.source.y ?? 0};
				const targetPoint = {x: d.target.x ?? 0, y: d.target.y ?? 0};

				if (d.source.x === d.target.x && d.source.y === d.target.y) {
					d.scaledSource = sourcePoint;
					d.scaledTarget = targetPoint;
					return;
				}

				const diff = Vector.diff(targetPoint, sourcePoint);

				d.scaledSource = Vector.sum(
					sourcePoint,
					Vector.scale(diff, d.source.radius ?? 0)
				);

				d.scaledTarget = Vector.diff(
					targetPoint,
					Vector.scale(diff, d.target.radius ?? 0)
				);
			})
			.attr('x1', ({scaledSource}) => scaledSource?.x ?? 0)
			.attr('y1', ({scaledSource}) => scaledSource?.y ?? 0)
			.attr('x2', ({scaledTarget}) => scaledTarget?.x ?? 0)
			.attr('y2', ({scaledTarget}) => scaledTarget?.y ?? 0);
	}
}

export default D3Chart;
