import {querySparql} from '@/lib/wikidata/client';
import {toGraph} from './graph';

export async function runGraphQuery(query: string, signal?: AbortSignal) {
	try {
		const sparqlRows = await querySparql(query, signal);
		return toGraph(sparqlRows);
	} catch (error) {
		console.error(error);
	}
}
