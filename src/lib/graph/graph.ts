import type {Graph, GraphRow, Link, Node} from '@/lib/graph/types';
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

	const nodes: Node[] = [];
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
			size: row.size,
		});
	}

	const links: Link[] = [];

	for (const row of rows) {
		if (!nodeIds.has(row.linkTo)) {
			continue;
		}

		links.push({
			source: row.item.value,
			target: row.linkTo,
		});
	}

	return {nodes, links};
}
