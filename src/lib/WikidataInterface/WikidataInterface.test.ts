import WikidataInterface from './WikidataInterface';

it('returns a Promise when submitting a SPARQL query', () => {
	WikidataInterface.request = function<T>(): Promise<T> {
		return new Promise(resolve => {
			resolve({
				'head': {
					'vars': ['item', 'itemLabel', 'linkTo']
				},
				'results': {
					'bindings': [{
						'item': {
							'type': 'uri',
							'value': 'http://www.wikidata.org/entity/Q9439'
						},
						'linkTo': {
							'type': 'uri',
							'value': 'http://www.wikidata.org/entity/Q20875'
						},
						'itemLabel': {
							'xml:lang': 'en',
							'type': 'literal',
							'value': 'Victoria'
						}
					}, {
						'item': {
							'type': 'uri',
							'value': 'http://www.wikidata.org/entity/Q9682'
						},
						'linkTo': {
							'type': 'uri',
							'value': 'http://www.wikidata.org/entity/Q154920'
						},
						'itemLabel': {
							'xml:lang': 'en',
							'type': 'literal',
							'value': 'Elizabeth II'
						}
					}]
				}
			} as unknown as T);
		});
	};

	return WikidataInterface.sparqlQuery('imagine some SPARQL query here')
		.then(results => expect(JSON.stringify(results)).toBe(
			'{"nodes":[{"id":"Q9439","label":"Victoria","uri":"https://www.wikidata.org/entity/Q9439"},{"id":"Q9682","label":"Elizabeth II","uri":"https://www.wikidata.org/entity/Q9682"}],"links":[]}'
		));
});

it('triggers a request when searching for entities', () => {
	WikidataInterface.request = function<T>(): Promise<T> {
		return new Promise(resolve => resolve('search() result' as unknown as T));
	};

	return WikidataInterface.search('imagine some search request here')
		.then(results => {
			expect(results).toBe('search() result');
		});
});

it('appends "property" parameter to the query string when searching for a property', () => {
	WikidataInterface.request = function <T>(url): Promise<T> {
		return new Promise(resolve => resolve(url as T));
	};

	return WikidataInterface.search('search string', 'property')
		.then(url => {
			expect(url).toEqual(expect.stringContaining('&type=property'));
		});
});

it('creates a Commons URL', () => {
	expect(WikidataInterface.createCommonsUrl('filename'))
		.toBe(`https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/filename/64px-filename`);
});

it('gets an entity', () => {
	WikidataInterface.request = function<T>(): Promise<T> {
		return new Promise(resolve => resolve({entities: {Q1: 'getEntity() result'}} as unknown as T));
	};

	return WikidataInterface.getEntity('Q1')
		.then(results => {
			expect(results).toBe('getEntity() result');
		});
});

it('gets an image URL', () => {
	expect(WikidataInterface.getImageUrl([{
		id: '',
		mainsnak: {
			datatype: 'commonsMedia',
			datavalue: {type: 'string', value: 'filename'},
			hash: '',
			id: '',
			property: '',
			snaktype: 'value',
		},
		rank: 'normal',
		type: 'string',
	}])).toBe(WikidataInterface.createCommonsUrl(('filename')));
});

it('gets missing image fallback URL', () => {
	expect(WikidataInterface.getImageUrl([]))
		.toBe(WikidataInterface.createCommonsUrl(WikidataInterface.imageFallback));
});