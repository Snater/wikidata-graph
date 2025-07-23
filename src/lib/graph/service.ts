import {querySparql} from '@/lib/wikidata/client';
import {toGraph} from './graph';

export async function runGraphQuery(query: string) {
	try {
		const sparqlRows = await querySparql(query);
		return toGraph(sparqlRows);
	} catch (error) {
		console.error(error);
	}
}
