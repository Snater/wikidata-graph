import {type D3DragEvent, type Selection, drag} from 'd3';
import type {D3ChartNode} from '@/lib/D3Chart/D3Chart';
import type {Simulation} from 'd3-force';

type NodeInteractionOptions = {
	hideTooltip: () => void
	showTooltip: (node: D3ChartNode, circle?: SVGCircleElement) => void
}

export function attachNodeDragBehaviour(simulation: Simulation<D3ChartNode, undefined>) {
	const dragStarted = (
		event: D3DragEvent<SVGCircleElement, D3ChartNode, D3ChartNode>,
		node: D3ChartNode
	) => {
		if (!event.active) {
			simulation?.alphaTarget(0.3).restart();
		}
		node.fx = node.x;
		node.fy = node.y;
	};

	const dragged = (
		event: D3DragEvent<SVGCircleElement, D3ChartNode, D3ChartNode>,
		node: D3ChartNode
	) => {
		node.fx = event.x;
		node.fy = event.y;
	};

	const dragEnded = (
		event: D3DragEvent<SVGCircleElement, D3ChartNode, D3ChartNode>,
		node: D3ChartNode
	) => {
		if (!event.active) {
			simulation?.alphaTarget(0);
		}
		node.fx = null;
		node.fy = null;
	};

	return drag<SVGCircleElement, D3ChartNode>()
		.on('start', dragStarted)
		.on('drag', dragged)
		.on('end', dragEnded);
}

export function attachNodeInteractions(
	selection: Selection<SVGCircleElement, D3ChartNode, SVGGElement, unknown>,
	options: NodeInteractionOptions
) {
	selection
		.on('mouseover', (event, node) => {
			options.showTooltip(node, event.currentTarget as SVGCircleElement);
		})
		.on('mouseout', () => {
			options.hideTooltip();
		});
}
