import {EntityId, SparqlResults, WBK} from 'wikibase-sdk';
import {parseLanguages} from '@/lib/language/language';
import {querySparql, request} from '@/lib/wikidata/client';
import {toGraph} from '@/lib/graph/graph';

const wdk = WBK({
	instance: 'https://www.wikidata.org',
	sparqlEndpoint: 'https://query.wikidata.org/sparql'
})

export type Language = {
	code: string
	label: string
}

export type Link = {
	source: string
	target: string
}

export type Node = {
	id: EntityId
	label: string
	uri: string
	size?: number
}

class WikidataInterface {

	static async getLanguages(): Promise<Language[]> {
		try {
			const response = await querySparql(`
				SELECT ?item ?itemLabel ?language_code (SAMPLE(?native_label) AS ?native_label) WHERE {
					?item wdt:P424 ?language_code.
					?item wdt:P218 ?iso_code.
					OPTIONAL { ?item wdt:P1705 ?native_label. }
					SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
				}
				GROUP BY ?item ?itemLabel ?language_code
				ORDER BY ?itemLabel ?item
			`);

			return parseLanguages(response);
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	static sparqlQuery(sparql: string): Promise<{nodes: Node[], links: Link[]} | void> {
		return request<SparqlResults>(wdk.sparqlQuery(sparql))
			.then(response => toGraph(wdk.simplify.sparqlResults(response)))
			.catch(error => console.error(error));
	}
}

export default WikidataInterface;
