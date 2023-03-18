import {Claims, PropertyClaims} from 'wikibase-sdk/src/types/claim';
import {Entities, Entity, EntityId, EntityType, Item} from 'wikibase-sdk/dist/types/entity';
import MD5 from 'md5';
import {SparqlResults, WBK} from 'wikibase-sdk'
import {SparqlValueType} from 'wikibase-sdk/src/types/sparql';

const wdk = WBK({
	instance: 'https://www.wikidata.org',
	sparqlEndpoint: 'https://query.wikidata.org/sparql'
})

type Language = {
	code: string
	label: string
}

type LanguageResult = {
	item: {
		label: string
	}
	language_code: string
	native_label: string
}

type Result = {
	item: {
		label: string
		value: string
	}
	linkTo: string
	size: number
}

class WikidataInterface {

	static imageFallback = 'No_image_available_500_x_500.svg';

	static request<T>(url: string): Promise<T> {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.open('GET', url);
			request.onload = () =>
				request.status === 200
					? resolve(JSON.parse(request.response))
					: reject(Error(request.statusText));
			request.onerror = error => reject(error);
			request.send();
		});
	}

	static getEntity(id: EntityId): Promise<Entity> {
		return WikidataInterface.request<{entities: Entities}>(wdk.getEntities({
			ids: [id],
			languages: ['en'],
			props: ['claims'],
		}))
			.then(response => response.entities[id]);
	}

	static search(search: string, type?: EntityType) {
		let url = wdk.searchEntities({search});

		if (type === 'property') {
			url += '&type=property';
		}

		return WikidataInterface.request(url);
	}

	/**
	 * Retrieves all available languages. Each object contains the fields "code"
	 * and "label" with "label" being the native language label or, if none is
	 * provided, the English label. Languages featuring the same English label are
	 * filtered out.
	 */
	static getLanguages() {
		return WikidataInterface.request(wdk.sparqlQuery(`
			SELECT ?item ?itemLabel ?language_code (SAMPLE(?native_label) AS ?native_label) WHERE {
				?item wdt:P424 ?language_code.
				?item wdt:P31 wd:Q34770.
				MINUS { ?item (wdt:P31/wdt:P279*) wd:Q152559. } # macrolanguage
				MINUS { ?item (wdt:P31/wdt:P279*) wd:Q14827288. } # Wikimedia project
				MINUS { ?item (wdt:P31/wdt:P279*) wd:Q17442446. } # Wikimedia internal item
				MINUS { ?item (wdt:P31/wdt:P279*) wd:Q20671729. } # Wikinews language edition
				MINUS { ?item (wdt:P31/wdt:P279*) wd:Q21450877. } # Wikimedia multilingual project main page
				MINUS { ?item wdt:P4913 ?main_language. } # is a dialect
				OPTIONAL { ?item wdt:P1705 ?native_label. }
				SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
			}
			GROUP BY ?item ?itemLabel ?language_code
			ORDER BY ?itemLabel ?item`
		))
			.then((response: SparqlResults) => wdk.simplify.sparqlResults(response))
			.then((results: Record<string, SparqlValueType>[]) => results.filter(
				(el: LanguageResult, index: number, self: LanguageResult[]) =>
					self.findIndex(t => t.item.label === el.item.label) === index)
			)
			.then(results => results.map((el: LanguageResult) => Object.create(
					{code: el.language_code, label: el.native_label || el.item.label}
				) as Language))
			.then(results => results.sort((a: Language, b: Language) => a.label < b.label ? -1 : 1))
			.catch(error => console.error(error));
	}

	static sparqlQuery(sparql: string) {
		return WikidataInterface.request(wdk.sparqlQuery(sparql))
			.then((response: SparqlResults) => wdk.simplify.sparqlResults(response))
			.then((results: Result[]) => Object.assign({}, {
					nodes: WikidataInterface.parseNodes(results),
					links: WikidataInterface.parseLinks(results),
				}))
			.catch(error => console.error(error));
	}

	static parseNodes(results: Result[]) {
		return results
			.map(el => Object.assign({}, {
				id: el.item.value,
				label: el.item.label,
				uri: `https://www.wikidata.org/entity/${el.item.value}`,
				size: el.size,
			}))
			.filter((el, index, self) => self.findIndex(t => t.id === el.id) === index);
	}

	static parseLinks(results: Result[]) {
		return results
			.filter(el => results.find(result => el.linkTo === result.item.value))
			.map(el => Object.assign({}, {source: el.item.value, target: el.linkTo}));
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

	static createImage(claims: Claims): Promise<HTMLImageElement> {
		const img = new Image();
		let imgUrl = WikidataInterface.getImageUrl(claims.P18);

		return new Promise(resolve => {
			img.onload = () => resolve(img);
			img.alt = '';
			img.src = imgUrl;
		});
	}

	static getImageUrl(propertyClaims?: PropertyClaims) {
		if (propertyClaims && propertyClaims.length > 0) {
			const mainsnak = propertyClaims[0].mainsnak;

			if (mainsnak.datatype === 'commonsMedia') {
				const value = mainsnak.datavalue?.value;

				if (typeof value !== 'string') {
					return '';
				}

				return WikidataInterface.createCommonsUrl(value.replace(/ /g, '_'))
			}
		}

		return WikidataInterface.createCommonsUrl(WikidataInterface.imageFallback);
	}

	static createCommonsUrl(filename: string) {
		const md5 = MD5(filename);
		const extension = filename.endsWith('.svg') ? '.png' : '';
		return `https://upload.wikimedia.org/wikipedia/commons/thumb/${md5[0]}/${md5[0]}${md5[1]}/${filename}/64px-${filename}${extension}`;
	}
}

export default WikidataInterface;