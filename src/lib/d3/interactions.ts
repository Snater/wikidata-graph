import {type D3DragEvent, type Selection, drag} from 'd3';
import type {D3GraphNode} from '@/lib/D3Graph/types';
import type {Simulation} from 'd3-force';

type NodeInteractionOptions = {
	hideTooltip: () => void
	showTooltip: (node: D3GraphNode, circle?: SVGCircleElement) => void
}

type LabelInteractionOptions = {
	nodes?: Selection<SVGCircleElement, D3GraphNode, SVGGElement, unknown>
	hideTooltip: () => void
	showTooltip: (node: D3GraphNode, circle?: SVGCircleElement) => void
}

export function attachNodeDragBehaviour(simulation: Simulation<D3GraphNode, undefined>) {
	const dragStarted = (
		event: D3DragEvent<SVGCircleElement, D3GraphNode, D3GraphNode>,
		node: D3GraphNode
	) => {
		if (!event.active) {
			simulation?.alphaTarget(0.3).restart();
		}
		node.fx = node.x;
		node.fy = node.y;
	};

	const dragged = (
		event: D3DragEvent<SVGCircleElement, D3GraphNode, D3GraphNode>,
		node: D3GraphNode
	) => {
		node.fx = event.x;
		node.fy = event.y;
	};

	const dragEnded = (
		event: D3DragEvent<SVGCircleElement, D3GraphNode, D3GraphNode>,
		node: D3GraphNode
	) => {
		if (!event.active) {
			simulation?.alphaTarget(0);
		}
		node.fx = null;
		node.fy = null;
	};

	return drag<SVGCircleElement, D3GraphNode>()
		.on('start', dragStarted)
		.on('drag', dragged)
		.on('end', dragEnded);
}

export function attachNodeInteractions(
	selection: Selection<SVGCircleElement, D3GraphNode, SVGGElement, unknown>,
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

export function attachLabelInteractions(
	selection: Selection<SVGTextElement, D3GraphNode, SVGGElement, unknown>,
	options: LabelInteractionOptions
) {
	selection
		.on('click', (_event, node) => {
			window.open(node.uri);
		})
		.on('keydown', (event, node) => {
			if (event.key === 'Enter') {
				window.open(node.uri);
			}
		})
		.on('mouseover', (_event, node) => {

			if (!options.nodes || node.index === undefined) {
				return;
			}

			const circle = options.nodes
				.filter(`:nth-child(${node.index + 1})`)
				.node();

			if (circle) {
				options.showTooltip(node, circle);
			}
		})
		.on('mouseout', () => {
			options.hideTooltip();
		});
}
