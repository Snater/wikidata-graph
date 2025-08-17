import type {Graph, GraphLink, GraphNode, GraphRow} from '@/lib/graph/types';
import {getEntity, getNumber, getString} from '@/lib/sparql/extractors';
import type {EntityId} from 'wikibase-sdk';
import type {SparqlRow} from '@/lib/sparql/types';

export function parseGraphRows(rows: SparqlRow[]): GraphRow[] {
	const results: GraphRow[] = [];

	for (const row of rows) {
		const item = getEntity(row, 'item');
		const linkTo = getString(row, 'linkTo');
		const size = getNumber(row, 'size');

		if (!item || !linkTo) {
			continue;
		}

		results.push({item, linkTo, size});
	}

	return results;
}

export function toGraph(sparqlRows: SparqlRow[]): Graph {
	const rows = parseGraphRows(sparqlRows);

	const nodes: GraphNode[] = [];
	const nodeIds = new Set<string>();

	for (const row of rows) {
		const id = row.item.value as EntityId;

		if (nodeIds.has(id)) {
			continue;
		}

		nodeIds.add(id);

		nodes.push({
			id,
			label: row.item.label,
			uri: `https://www.wikidata.org/entity/${id}`,
			size: row.size ?? 1,
		});
	}

	const links: GraphLink[] = [];

	for (const row of rows) {
		if (!nodeIds.has(row.linkTo)) {
			continue;
		}

		links.push({
			id: `${row.item.value}-${row.linkTo}`,
			source: row.item.value,
			target: row.linkTo,
		});
	}

	return {nodes, links};
}
