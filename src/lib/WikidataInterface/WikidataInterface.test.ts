import WikidataInterface from './WikidataInterface';

const originalFetch = global.fetch;
const originalConsoleError = console.error;

afterAll(() => {
	global.fetch = originalFetch;
	console.error = originalConsoleError;
})

it('retrieves an entity', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve({entities: {Q1: 'getEntity() result'}}),
		ok: true,
	}));

	const response = await WikidataInterface.getEntity('Q1');
	expect(response).toEqual('getEntity() result');
});

it('throws an error when unable to retrieve an entity', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve(),
		ok: false,
	}));

	await expect(WikidataInterface.getEntity('Q999')).rejects.toBeTruthy();
});

it('returns a Promise when submitting a SPARQL query', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve({
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
		}),
		ok: true,
	}));

	const sparqlQuery = await WikidataInterface.sparqlQuery('imagine some SPARQL query here');

	return expect(sparqlQuery).toEqual({
		nodes: [
			{
				id: 'Q9439',
				label: 'Victoria',
				uri: 'https://www.wikidata.org/entity/Q9439',
			}, {
				id: 'Q9682',
				label:'Elizabeth II',
				uri:'https://www.wikidata.org/entity/Q9682',
			},
		],
		links: [],
	});
});

it('triggers a request when searching for entities', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve('search() result'),
		ok: true,
	}));

	const results = await WikidataInterface.search('imagine some search request here');

	expect(results).toBe('search() result');
});

it('appends "property" parameter to the query string when searching for a property', () => {
	global.fetch = jest.fn().mockImplementation((url: string) => Promise.resolve({
		json: () => Promise.resolve(url),
		ok: true,
	}));

	return WikidataInterface.search('search string', 'property')
		.then(url => {
			expect(url).toEqual(expect.stringContaining('&type=property'));
		});
});

it('creates a Commons URL', () => {
	expect(WikidataInterface.createCommonsUrl('filename'))
		.toBe(`https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/filename/64px-filename`);
});

it('gets an image URL', () => {
	expect(WikidataInterface.getImageUrl([{
		id: 'Q1$',
		mainsnak: {
			datatype: 'commonsMedia',
			datavalue: {type: 'string', value: 'filename'},
			hash: '',
			property: 'P1',
			snaktype: 'value',
		},
		rank: 'normal',
		type: 'statement',
	}])).toBe(WikidataInterface.createCommonsUrl(('filename')));
});

it('gets missing image fallback URL', () => {
	expect(WikidataInterface.getImageUrl([]))
		.toBe(WikidataInterface.createCommonsUrl(WikidataInterface.imageFallback));
});

it('retrieves the languages', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve({
			head: {
				vars: ['item', 'itemLabel', 'language_code', 'native_label'],
			},
			results: {
				bindings: [{
						item: {
							type: 'uri',
							value: 'http://www.wikidata.org/entity/Q1860'
						},
						itemLabel: {
							'xml:lang': 'en',
							type: 'literal',
							value: 'English'
						},
						language_code: {
							type: 'literal',
							value: 'en'
						},
						native_label: {
							'xml:lang': 'en',
							type: 'literal',
							value: 'English'
						},
					},
				],
			},
		}),
		ok: true,
	}));

	const languages = await WikidataInterface.getLanguages();

	expect(languages).toEqual([{code: 'en', label: 'English'}]);
});

it('logs error when retrieving the language fails', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve(),
		ok: false,
	}));

	console.error = jest.fn();

	await WikidataInterface.getLanguages();

	expect(console.error).toHaveBeenCalledTimes(1);
});
