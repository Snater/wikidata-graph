import WikidataInterface from './WikidataInterface';

const originalImage = Image;
const originalFetch = global.fetch;
const originalConsoleError = console.error;

afterEach(() => {
	global.fetch = originalFetch;
	console.error = originalConsoleError;
});

beforeAll(() => {
	global.Image = class {
		onload: () => void;

		constructor() {
			this.onload = jest.fn();
			setTimeout(() => {
				this.onload();
			}, 50);
		}
	} as unknown as typeof originalImage;
});

afterAll(() => {
	global.Image = originalImage;
});

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
			head: {
				vars: ['item', 'itemLabel', 'linkTo']
			},
			results: {
				bindings: [{
					item: {
						type: 'uri',
						value: 'http://www.wikidata.org/entity/Q9439'
					},
					linkTo: {
						type: 'uri',
						value: 'http://www.wikidata.org/entity/Q20875'
					},
					itemLabel: {
						'xml:lang': 'en',
						type: 'literal',
						value: 'Victoria'
					}
				}, {
					item: {
						type: 'uri',
						value: 'http://www.wikidata.org/entity/Q9682'
					},
					linkTo: {
						type: 'uri',
						value: 'http://www.wikidata.org/entity/Q154920'
					},
					itemLabel: {
						'xml:lang': 'en',
						type: 'literal',
						value: 'Elizabeth II'
					}
				}, {
					item: {
						type: 'uri',
						value: 'http://www.wikidata.org/entity/Q1234'
					},
					linkTo: {
						type: 'uri',
						value: 'http://www.wikidata.org/entity/Q9682'
					},
					itemLabel: {
						'xml:lang': 'en',
						type: 'literal',
						value: 'Test Link'
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
				label: 'Elizabeth II',
				uri: 'https://www.wikidata.org/entity/Q9682',
			}, {
				id: 'Q1234',
				label: 'Test Link',
				uri: 'https://www.wikidata.org/entity/Q1234',
			},
		],
		links: [{
			source: 'Q1234',
			target: 'Q9682',
		}],
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

it('logs error when SPARQL query failed', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve(),
		ok: false,
	}));

	console.error = jest.fn();

	await WikidataInterface.sparqlQuery('');

	expect(console.error).toHaveBeenCalledTimes(1);
});

it('retrieves an entity image', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve({
			entities: {
				Q6789: {
					claims: {
						P18: [{
							mainsnak: {
								datavalue: {value: 'image_URL_placeholder'},
								datatype: 'commonsMedia'
							},
						}],
					},
				},
			},
		}),
		ok: true,
	}));

	const image = await WikidataInterface.getEntityImage('Q6789');

	expect(image).toBeInstanceOf(Image);
	expect(image.src).toContain('/image_URL_placeholder/');
});

it('fails retrieving image when value\'s data type is not a string', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve({
			entities: {
				Q2345: {
					claims: {
						P18: [{
							mainsnak: {
								datavalue: {value: 123},
								datatype: 'commonsMedia'
							},
						}],
					},
				},
			},
		}),
		ok: true,
	}));

	const image = await WikidataInterface.getEntityImage('Q2345');

	expect(image).toBeInstanceOf(Image);
	expect(image.src).toContain('No_image_available');
});

it('fails retrieving image when no claim to retrieve Commons image from', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve({
			entities: {Q9876: {}},
		}),
		ok: true,
	}));

	const image = await WikidataInterface.getEntityImage('Q9876');

	expect(image).toBeInstanceOf(Image);
	expect(image.src).toContain('No_image_available');
});
