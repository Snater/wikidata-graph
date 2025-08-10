import {tip} from 'd3-v6-tip';
import type {Selection} from 'd3-selection';
import {getEntityImage} from '@/lib/wikidata/image';
import type {GraphNode} from '@/lib/graph/types';

export function createTooltipController(
	labels?: Selection<SVGTextElement, Node, any, any>
) {

	const tooltip = tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0]);

	function hide() {
		tooltip.html('');
		tooltip.hide();
		labels?.style('opacity', 1);
	}

	async function show(node: GraphNode, circle?: SVGCircleElement) {
		if (!circle) {
			return;
		}

		labels?.filter(`:not(:nth-child(${(node as any).index + 1}))`)
			.style('opacity', 0.3);

		try {
			const img = await getEntityImage(node.id);
			const size = measureImage(img);

			tooltip.html(
				`<img alt="" src="${img.src}" height="${size.height}" width="${size.width}">`
			);

			tooltip.show(node, circle);
		} catch {
			tooltip.html('no image');
			tooltip.show(node, circle);
		}
	}

	return {tooltip, show, hide};
}

function measureImage(img: HTMLImageElement) {
	const container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.left = '-999px';
	container.style.top = '-999px';

	document.body.appendChild(container);
	container.appendChild(img);

	const result = {
		height: container.clientHeight,
		width: container.clientWidth,
	};

	container.remove();
	return result;
}
