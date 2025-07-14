import { type EntityId, simplify } from 'wikibase-sdk';
import type { Link, Node } from '@/lib/WikidataInterface/WikidataInterface';
import { getEntity, getNumber, getString } from "@/lib/sparql/extractors";

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
			const item = getEntity(row, 'item');
			const linkTo = getString(row, 'linkTo');
			const size = getNumber(row, 'size');

			if (!item || !linkTo || !size) {
				continue;
			}

			results.push({item, linkTo, size});
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