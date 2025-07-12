import { type EntityId, simplify } from 'wikibase-sdk';
import type { Link, Node } from '@/lib/WikidataInterface/WikidataInterface';

export type GraphResult = {
	nodes: Node[]
	links: Link[]
}

export type RawGraphResult = {
	item: { label: string; value: string }
	linkTo: string
	size: number
}

export default class GraphMapper {

	static toRawGraph(rows: ReturnType<typeof simplify.sparqlResults>): RawGraphResult[] {

		const results: RawGraphResult[] = [];

		for (const row of rows) {
			const item = (row as unknown as Record<string, unknown>).item;
			const linkTo = (row as unknown as Record<string, unknown>).linkTo;
			const size = (row as unknown as Record<string, unknown>).size;

			if (
				!item
				|| typeof item !== 'object'
				|| !('value' in item)
				|| !('label' in item)
				|| typeof item.value !== 'string'
				|| typeof item.label !== 'string'
				|| typeof linkTo !== 'string'
				|| typeof size !== 'number'
			) {
				continue;
			}

			results.push({
				item: { value: item.value, label: item.label },
				linkTo,
				size,
			});
		}

		return results;
	}

	static toGraph(results: RawGraphResult[]): GraphResult {
		return {
			nodes: this.mapNodes(results),
			links: this.mapLinks(results),
		};
	}

	private static mapNodes(results: RawGraphResult[]): Node[] {
		const seen = new Set<string>();

		const nodes: Node[] = [];

		for (const result of results) {
			const id = result.item.value as EntityId;

			if (seen.has(id)) {
				continue;
			}
			seen.add(id);

			nodes.push({
				id,
				label: result.item.label,
				uri: `https://www.wikidata.org/entity/${id}`,
				size: result.size ?? 1,
			});
		}

		return nodes;
	}

	private static mapLinks(results: RawGraphResult[]): Link[] {
		const nodeIds = new Set(results.map(result => result.item.value));

		const links: Link[] = [];

		for (const result of results) {
			if (
				!result.linkTo
				|| !nodeIds.has(result.linkTo)
			) {
				continue;
			}

			links.push({
				source: result.item.value,
				target: result.linkTo,
			});
		}

		return links;
	}
}