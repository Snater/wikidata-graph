import * as wdk from 'wikidata-sdk';
import MD5 from 'md5';

class WikidataInterface {

	/**
	 * @type {string}
	 */
	static imageFallback = 'No_image_available_500_x_500.svg';

	/**
	 * @param {string} url
	 * @return {Promise<*>}
	 */
	static request(url) {
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

	/**
	 * @param {string} id
	 * @return {Promise<Object>}
	 */
	static getEntity(id) {
		return WikidataInterface.request(wdk.getEntities({
			ids: [id],
			languages: ['en'],
			props: ['claims'],
		}))
			.then(response => response.entities[id]);
	}

	/**
	 * @param {string} searchString
	 * @param {string} [type]
	 * @return {Promise<Object[]>}
	 */
	static search(searchString, type) {
		let url = wdk.searchEntities(searchString);

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
	 * @return {Promise<Object[]>}
	 */
	static getLanguages() {
		return WikidataInterface.request(wdk.sparqlQuery(`
			SELECT ?item ?itemLabel ?language_code ?native_label WHERE {
				?item wdt:P424 ?language_code.
				MINUS { ?item (wdt:P31/wdt:P279*) wd:Q14827288. }
				MINUS { ?item (wdt:P31/wdt:P279*) wd:Q17442446. }
				OPTIONAL { ?item wdt:P1705 ?native_label. }
				SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
			}`))
			.then(response => wdk.simplify.sparqlResults(response))
			.then(results => results.filter((el, index, self) => self.findIndex(
					t => t.item.label === el.item.label
				) === index)
			)
			.then(results => results.map(el => Object.create(
					{code: el.language_code, label: el.native_label || el.item.label}
				)))
			.then(results => results.sort((a, b) => a.label < b.label ? -1 : 1))
			.catch(error => console.error(error));
	}

	/**
	 * @param {string} sparql
	 * @return {Promise<Object[]>}
	 */
	static sparqlQuery(sparql) {
		return WikidataInterface.request(wdk.sparqlQuery(sparql))
			.then(response => wdk.simplify.sparqlResults(response))
			.then(results => Object.assign({}, {
					nodes: WikidataInterface.parseNodes(results),
					links: WikidataInterface.parseLinks(results),
				}))
			.catch(error => console.error(error));
	}

	/**
	 * @param {Object[]} simplifiedResults
	 * @return {Object}
	 */
	static parseNodes(simplifiedResults) {
		return simplifiedResults
			.map(el => Object.assign({}, {
				id: el.item.value,
				label: el.item.label,
				uri: `https://www.wikidata.org/entity/${el.item.value}`,
				size: el.size,
			}))
			.filter(
				(el, index, self) => self.findIndex(t => t.id === el.id) === index
			);
	}

	/**
	 * @param {Object[]} simplifiedResults
	 * @return {Object}
	 */
	static parseLinks(simplifiedResults) {
		return simplifiedResults
			.filter(el => simplifiedResults.find(result => el.linkTo === result.item.value))
			.map(el => Object.assign({}, {source: el.item.value, target: el.linkTo}));
	}

	/**
	 * @param {string} id
	 * @return {Promise<string>}
	 */
	static getEntityImage(id) {
		return new Promise(() => {
			WikidataInterface.getEntity(id)
				.then(entity => WikidataInterface.createImage(entity.claims));
		});
	}

	/**
	 * @param {Object} [claims]
	 * @return {Promise<string>}
	 */
	static createImage(claims) {
		const img = new Image();
		let imgUrl = WikidataInterface.getImageUrl(claims.P18);

		return new Promise((resolve) => {
			img.onload = () => resolve(imgUrl);
			img.src = imgUrl;
		});
	}

	/**
	 * @param {Object[]} [propertyClaims]
	 * @return {string}
	 */
	static getImageUrl(propertyClaims) {
		if (propertyClaims) {
			const mainsnak = propertyClaims[0].mainsnak;

			if (mainsnak.datatype === 'commonsMedia') {
				const filename = mainsnak.datavalue.value.replace(/ /g, '_');
				return WikidataInterface.createCommonsUrl(filename);
			}
		}

		return WikidataInterface.createCommonsUrl(WikidataInterface.imageFallback);
	}

	/**
	 * @param {string} filename
	 * @return {string}
	 */
	static createCommonsUrl(filename) {
		const md5 = MD5(filename);
		const extension = filename.endsWith('.svg') ? '.png' : '';
		return `https://upload.wikimedia.org/wikipedia/commons/thumb/${md5[0]}/${md5[0]}${md5[1]}/${filename}/64px-${filename}${extension}`;
	}
}

export default WikidataInterface;
