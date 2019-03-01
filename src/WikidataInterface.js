import * as wdk from 'wikidata-sdk';

class Wikidatainterface {

	/**
	 * @param {string} url
	 * @return {Promise}
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
	 * @param {string} searchString
	 * @param {string} [type]
	 * @return {Promise}
	 */
	static search(searchString, type) {
		let url = wdk.searchEntities(searchString);

		if (type === 'property') {
			url += '&type=property';
		}

		return this.request(url);
	}

	/**
	 * Retrieves all available languages. Each object contains the fields "code"
	 * and "label" with "label" being the native language label or, if none is
	 * provided, the English label. Languages featuring the same English label are
	 * filtered out.
	 * @return {Promise.<Object[]>}
	 */
	static getLanguages() {
		return this.request(wdk.sparqlQuery(`
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
	 * @return {Promise.<Object[]>}
	 */
	static sparqlQuery(sparql) {
		return this.request(wdk.sparqlQuery(sparql))
			.then(response => wdk.simplify.sparqlResults(response))
			.then(results => this.convertToNodesAndLinks(results))
			.catch(error => console.error(error));
	}

	/**
	 * @param {Object[]} simplifiedResults
	 * @return {Object}
	 */
	static convertToNodesAndLinks(simplifiedResults) {
		const nodes = simplifiedResults
			.map(el => Object.create({
				id: el.item.value,
				label: el.item.label,
				uri: `https://www.wikidata.org/entity/${el.item.value}`,
			}))
			.filter(
				(el, index, self) => self.findIndex(t => t.id === el.id) === index
			);

		const links = simplifiedResults
			.filter(el => nodes.find(node => el.linkTo === node.id))
			.map(el => Object.create({source: el.item.value, target: el.linkTo}));

		return {
			nodes: nodes,
			links: links,
		}
	}
}

export default Wikidatainterface;
