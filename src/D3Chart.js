import * as d3 from 'd3';
import './D3Chart.css';

class D3Chart {

	/**
	 * @param {HTMLElement} element
	 */
	constructor(element) {
		this.element = element;
	}

	/**
	 * @param {Object} state
	 */
	create(state) {
		this.svg = d3.select(this.element).append('svg')
			.attr('class', 'D3Chart');

		this.update(state);
	}

	/**
	 * @param {Object} state
	 */
	update(state) {
		this.svg.selectAll('*').remove();
		this._draw(state);
	}

	/**
	 * @param {Object} state
	 */
	_draw(state) {
		this.container = this.svg.append('g');
		this.svg
			.attr('width', state.width)
			.attr('height', state.height)
			.call(d3.zoom().on('zoom', () => this._onZoom()));

		this._createSimulation(state.data);

		const nodes = this._drawNodes(state.data.nodes);
		const links = this._drawLinks(state.data.links);
		const labels = this._drawLabels(state.data.nodes);

		this.simulation.on('tick', () => this._onTick(nodes, links, labels));
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
	 * @return {d3.selection}
	 */
	_drawNodes(nodes) {
		return this.container.append('g')
			.attr('stroke', '#999')
			.attr('stroke-width', 1.5)
			.selectAll('circle')
			.data(nodes)
			.join('circle')
			.attr('r', 5)
			.call(this._attachDragHandlers());
	}

	/**
	 * @param {Object[]} links
	 * @return {d3.selection}
	 */
	_drawLinks(links) {
		return this.container.append('g')
			.attr('stroke', '#999')
			.attr('stroke-opacity', 0.6)
			.selectAll('line')
			.data(links)
			.join('line')
			.attr('stroke-width', 1);
	}

	/**
	 * @param {Object[]} nodes
	 * @return {d3.selection}
	 */
	_drawLabels(nodes) {
		return this.container.append('g')
			.selectAll('text')
			.data(nodes)
			.enter()
			.append('text')
			.attr('x', 8)
			.attr('y', '.31em')
			.text(d => d.label);
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
	}

	/**
	 * @param {d3.selection} nodes
	 * @param {d3.selection} links
	 * @param {d3.selection} labels
	 */
	_onTick(nodes, links, labels) {
		nodes
			.attr("cx", d => d.x)
			.attr("cy", d => d.y);

		links
			.attr("x1", d => d.source.x)
			.attr("y1", d => d.source.y)
			.attr("x2", d => d.target.x)
			.attr("y2", d => d.target.y);

		labels.attr('transform', d => `translate(${d.x},${d.y})`);
	}
}

export default D3Chart;
