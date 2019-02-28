class SparqlGenerator {

	/**
	 * @param data
	 * @return {string}
	 */
	generate(data) {
		if (!data.item || !data.property) {
			throw new Error('Item and property are required to generate a SPARQL query.')
		}

		const prefix = SparqlGenerator.useGAS(data)
			? 'PREFIX gas: <http://www.bigdata.com/rdf/gas#>\n\n' : '';

			return `${prefix}SELECT ?item ?itemLabel ?linkTo {
  ${this._generateClause(data)}
  OPTIONAL { ?item wdt:${data.property} ?linkTo }
  SERVICE wikibase:label {bd:serviceParam wikibase:language "${data.language}" }
}`
	}

	/**
	 * @param {Object} data
	 * @return {string}
	 */
	_generateClause(data) {
		if (data.mode === 'both') {
			return `{ ${this._generateClause({...data, mode: 'forward' })} }`
				+ ` UNION { ${this._generateClause({...data, mode: 'reverse' })} }`;
		} else if (!SparqlGenerator.useGAS(data)) {
			if (data.mode === 'forward') {
				return `wd:${data.item} wdt:${data.property}* ?item`;
			} else if (data.mode === 'reverse') {
				return `?item wdt:${data.property}* wd:${data.item}`;
			} else {
				throw new Error('GAS can be used on forward and reverse traversing only.')
			}
		} else {
			return `SERVICE gas:service {
  gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP";
  gas:in wd:${data.item};
  gas:traversalDirection "${SparqlGenerator.capitalize(data.mode)}";
  gas:out ?item;
  gas:out1 ?depth;${typeof data.iterations !== 'number' || data.iterations === 0 ? '' : `
  gas:maxIterations ${data.iterations};`
  }${typeof data.limit !== 'number' || data.limit === 0 ? '' : `
  gas:maxVisited ${data.limit};`
  }
  gas:linkType wdt:${data.property}.
}`;
		}
	}

	/**
	 * Whether to use the Gather Apply Scatter model.
	 * (https://wiki.blazegraph.com/wiki/index.php/RDF_GAS_API)
	 *
	 * @param {Object} data
	 * @return {boolean}
	 */
	static useGAS(data) {
		return data.limit > 0 || data.iterations > 0;
	}

	/**
	 * @param {string} string
	 * @return {string}
	 */
	static capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}

export default SparqlGenerator;