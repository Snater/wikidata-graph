import {
	Claims,
	Entities,
	Entity,
	EntityId,
	EntityType,
	Item,
	PropertyClaims,
	SearchResponse,
	SparqlResults,
	WBK,
} from 'wikibase-sdk';
import MD5 from 'md5';
import {isLanguageResult} from "@/lib/sparql/guards";
import {toGraph} from "@/lib/graph/graph";
import { parseLanguages } from "@/lib/language/language";

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
	size: number
}

class WikidataInterface {

	private static cache: Record<EntityId, Entity> = {};

	private static imageFallback = 'No_image_available_500_x_500.svg';

	private static async request<T>(url: string): Promise<T> {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		return response.json();
	}

	static async getEntity(id: EntityId): Promise<Entity> {
		if (!WikidataInterface.cache[id]) {
			const response = await WikidataInterface.request<{ entities: Entities }>(wdk.getEntities({
				ids: [id],
				languages: ['en'],
				props: ['claims'],
			}));

			WikidataInterface.cache[id] = response.entities[id];
		}

		return WikidataInterface.cache[id];
	}

	static search(search: string, type?: EntityType): Promise<SearchResponse> {
		let url = wdk.searchEntities({search});

		if (type === 'property') {
			url += '&type=property';
		}

		return WikidataInterface.request(url);
	}

	static async getLanguages(): Promise<Language[]> {
		try {
			const response = await WikidataInterface.request<SparqlResults>(wdk.sparqlQuery(`
				SELECT ?item ?itemLabel ?language_code (SAMPLE(?native_label) AS ?native_label) WHERE {
					?item wdt:P424 ?language_code.
					?item wdt:P218 ?iso_code.
					OPTIONAL { ?item wdt:P1705 ?native_label. }
					SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
				}
				GROUP BY ?item ?itemLabel ?language_code
				ORDER BY ?itemLabel ?item
			`));

			return parseLanguages(response);
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	static sparqlQuery(sparql: string): Promise<{nodes: Node[], links: Link[]} | void> {
		return WikidataInterface.request<SparqlResults>(wdk.sparqlQuery(sparql))
			.then(response => toGraph(wdk.simplify.sparqlResults(response)))
			.catch(error => console.error(error));
	}

	static getEntityImage(id: EntityId): Promise<HTMLImageElement> {
		return new Promise(resolve => {
			WikidataInterface.getEntity(id)
				.then(entity => {
					const item = entity as Item;
					return resolve(WikidataInterface.createImage(item.claims))
				});
		});
	}

	private static createImage(claims?: Claims): Promise<HTMLImageElement> {
		const img = new Image();
		const imgUrl = WikidataInterface.getImageUrl(claims?.P18);

		return new Promise(resolve => {
			img.onload = () => resolve(img);
			img.alt = '';
			img.src = imgUrl;
		});
	}

	private static getImageUrl(propertyClaims?: PropertyClaims): string {
		const mainsnak = propertyClaims?.[0]?.mainsnak;

		if (mainsnak?.datatype === 'commonsMedia') {
			const value = mainsnak.datavalue?.value;

			if (typeof value === 'string') {
				return WikidataInterface.createCommonsUrl(value.replace(/ /g, '_'));
			}
		}

		return WikidataInterface.createCommonsUrl(WikidataInterface.imageFallback);
	}

	private static createCommonsUrl(filename: string): string {
		const md5 = MD5(filename);
		const extension = filename.endsWith('.svg') ? '.png' : '';
		return `https://upload.wikimedia.org/wikipedia/commons/thumb/${md5[0]}/${md5[0]}${md5[1]}/${filename}/64px-${filename}${extension}`;
	}
}

export default WikidataInterface;
