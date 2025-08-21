import {
	type Entities,
	type Entity,
	type EntityId,
	type EntityType,
	type SearchResponse,
	type SparqlResults,
	WBK,
	simplify,
} from 'wikibase-sdk';
import type {SparqlRow} from '@/lib/sparql/types';

const wdk = WBK({
	instance: 'https://www.wikidata.org',
	sparqlEndpoint: 'https://query.wikidata.org/sparql'
});

const cache: Record<EntityId, Entity> = {};

export async function request<T>(url: string): Promise<T> {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(response.statusText);
	}

	return response.json();
}

export async function getEntity(id: EntityId): Promise<Entity> {
	if (!cache[id]) {
		const response = await request<{entities: Entities}>(wdk.getEntities({
			ids: [id],
			languages: ['en'],
			props: ['claims'],
		}));

		cache[id] = response.entities[id];
	}

	return cache[id];
}

export function searchEntities(search: string, type?: EntityType): Promise<SearchResponse> {
	let url = wdk.searchEntities({search});

	if (type === 'property') {
		url += '&type=property';
	}

	return request(url);
}

export async function querySparql(query: string): Promise<SparqlRow[]> {
	const response = await request<SparqlResults>(wdk.sparqlQuery(query));

	return simplify.sparqlResults(response);
}
