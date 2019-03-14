import * as d3 from 'd3';
import tip from 'd3-tip';
import Vector from '../Vector';
import './D3Chart.css';

class D3Chart {

	/**
	 * @param {HTMLElement} element
	 * @param {Function} getEntityImage
	 */
	constructor(element, getEntityImage) {
		this.svg = d3.select(element).append('svg')
			.attr('class', 'D3Chart');
		this._getEntityImage = getEntityImage;
		this._tooltip = this._createTooltip();
	}

	/**
	 * @return {Object}
	 */
	_createTooltip() {
		return tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0]);
	}

	/**
	 * @param {Object} state
	 */
	update(state) {
		this.svg.selectAll('*').remove();

		if (this._zoom) {
			this.svg
				.transition()
				.duration(800)
				.call(this._zoom.transform, d3.zoomIdentity);
		}

		this._draw(state);

		this._tooltip.hide();
	}

	/**
	 * @param {Object} state
	 */
	_draw(state) {
		this.container = this.svg.append('g');

		this.svg
			.attr('width', state.width)
			.attr('height', state.height)
			.call(this._zoom = d3.zoom().on('zoom', () => this._onZoom()))
			.call(this._tooltip);

		this._createSimulation(state.data);

		const nodes = this._calculateRadii(state.data.nodes);

		this._drawDefs(!!nodes[0].radius);

		const links = this._drawLinks(state.data.links);
		const circles = this._drawNodes(nodes, state.root);
		this._labels = this._drawLabels(nodes, circles);

		this.simulation.on('tick', () => this._onTick(circles, links, this._labels));
	}

	/**
	 * @param {Object[]} nodes
	 * @return {Object[]}
	 */
	_calculateRadii(nodes) {
		const sizes = nodes.map(node => node.size);
		const uniqueSizes = sizes.filter(
			(size, index, self) => self.indexOf(size) === index
		);

		if (uniqueSizes.length < 1) {
			return nodes;
		}

		const maxSize = nodes.reduce(
			(maxSize, node) =>
				node.size > maxSize || typeof maxSize !== 'number' ? node.size : maxSize
		);
		const minSize = nodes.reduce(
			(minSize, node) =>
				node.size < minSize || typeof minSize !== 'number' ? node.size : minSize
		);
		const scaleRange = [3, 20];
		const scale = d3.scaleLinear().domain([minSize, maxSize]).range(scaleRange);

		return nodes.map(node => Object.assign(node, {radius: scale(node.size)}));
	}

	/**
	 * @param {boolean} hasRadius
	 */
	_drawDefs(hasRadius) {
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

	/**
	 * @param {Object} data
	 */
	_createSimulation(data) {
		this.simulation = d3.forceSimulation(data.nodes)
			.force('link', d3.forceLink(data.links).id(d => d.id))
			.force('charge', d3.forceManyBody())
			.force('center', d3.forceCenter(
				(this.svg.attr('width') / 2) + 100, this.svg.attr('height') / 2)
			);
	}

	/**
	 * @param {Object[]} nodes
	 * @param {string} root
	 * @return {d3.selection}
	 */
	_drawNodes(nodes, root) {
		return this.container.append('g')
			.selectAll('circle')
			.data(nodes)
			.join('circle')
			.attr('r', d => d.radius || 5)
			.attr('class', d => d.id === root ? 'root' : '')
			.call(this._attachDragHandlers())
			.on(
				'mouseover',
				(d, index, circles) => this._enterTooltip(d, circles[index], index)
			)
			.on('mouseout', () => this._exitTooltip());
	}

	/**
	 * @param {Object[]} links
	 * @return {d3.selection}
	 */
	_drawLinks(links) {
		return this.container.append('g')
			.selectAll('line')
			.data(links)
			.join('line');
	}

	/**
	 * @param {Object[]} nodes
	 * @param {d3.selection} circles
	 * @return {d3.selection}
	 */
	_drawLabels(nodes, circles) {
		return this.container.append('g')
			.selectAll('text')
			.data(nodes)
			.enter()
			.append('text')
			.attr('x', 8)
			.attr('y', '.31em')
			.text(d => d.label)
			.on('click', d => window.open(d.uri))
			.on(
				'mouseover',
				(d, index, labels) => this._enterTooltip(
					d,
					circles.filter(`:nth-child(${d.index + 1})`).node(),
					index
				)
			)
			.on('mouseout', () => this._exitTooltip());
	}

	/**
	 * @param {Object} d
	 * @param {HTMLElement} target
	 *   Node to attach the tooltip to.
	 * @param {number} index
	 */
	_enterTooltip(d, target, index) {
		this._labels.filter(`:not(:nth-child(${index + 1}))`).style('opacity', 0.3);

		this._getEntityImage(d.id)
			.then(imgUrl => {
				this._tooltip.html(`<img src="${imgUrl}">`);
				this._tooltip.show(d, target);
			})
			.catch(() => {
				this._tooltip.html('no image');
				this._tooltip.show(d, target);
			});
	}

	_exitTooltip() {
		this._tooltip.html('');
		this._tooltip.hide();
		this._labels.style('opacity', 1);
	}

	/**
	 * @return Function
	 */
	_attachDragHandlers() {
		const dragStarted = d => {
			if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		};

		const dragged = d => {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		};

		const dragEnded = d => {
			if (!d3.event.active) this.simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		};

		return d3.drag()
			.on('start', dragStarted)
			.on('drag', dragged)
			.on('end', dragEnded);
	}

	_onZoom() {
		this.container.attr('transform', d3.event.transform);
		this._exitTooltip();
	}

	/**
	 * @param {d3.selection} nodes
	 * @param {d3.selection} links
	 * @param {d3.selection} labels
	 */
	_onTick(nodes, links, labels) {
		nodes
			.attr('cx', d => d.x)
			.attr('cy', d => d.y);

		this._calculateLine(links, nodes.filter(':first-child').datum().radius);

		labels.attr('transform', d => `translate(${d.x},${d.y})`);

		if (this._tooltip.style('opacity') === '1') {
			// Reset tooltip position:
			this._tooltip.hide().show();
		}
	}

	/**
	 * @param {d3.selection} links
	 * @param {boolean} hasSize
	 */
	_calculateLine(links, hasSize = false) {
		if (!hasSize) {
			links
				.attr('x1', d => d.source.x)
				.attr('y1', d => d.source.y)
				.attr('x2', d => d.target.x)
				.attr('y2', d => d.target.y);

			return;
		}

		links
			.each(d => {
				if (d.source.x === d.target.x && d.source.y === d.target.y) {
					d.scaledSource = d.source;
					d.scaledTarget  = d.target;
					return;
				}

				const diff = Vector.diff(d.target, d.source);

				d.scaledSource = Vector.sum(
					d.source,
					Vector.scale(diff, d.source.radius)
				);

				d.scaledTarget = Vector.diff(
					d.target,
					Vector.scale(diff, d.target.radius)
				);
			})
			.attr('x1', ({scaledSource}) => scaledSource.x)
			.attr('y1', ({scaledSource}) => scaledSource.y)
			.attr('x2', ({scaledTarget}) => scaledTarget.x)
			.attr('y2', ({scaledTarget}) => scaledTarget.y);
	}
}

export default D3Chart;
