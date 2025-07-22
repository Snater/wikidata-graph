import {EntityId, SparqlResults, WBK} from 'wikibase-sdk';
import {request} from '@/lib/wikidata/client';
import {toGraph} from '@/lib/graph/graph';

const wdk = WBK({
	instance: 'https://www.wikidata.org',
	sparqlEndpoint: 'https://query.wikidata.org/sparql'
})

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
	static sparqlQuery(sparql: string): Promise<{nodes: Node[], links: Link[]} | void> {
		return request<SparqlResults>(wdk.sparqlQuery(sparql))
			.then(response => toGraph(wdk.simplify.sparqlResults(response)))
			.catch(error => console.error(error));
	}
}

export default WikidataInterface;
