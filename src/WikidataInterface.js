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
			.map(el => Object.create({id: el.item.value, label: el.item.label}))
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
