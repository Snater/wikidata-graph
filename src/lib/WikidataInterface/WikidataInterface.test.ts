import WikidataInterface from './WikidataInterface';

const originalImage = Image;
const originalFetch = global.fetch;
const originalConsoleError = console.error;

afterEach(() => {
	global.fetch = originalFetch;
	console.error = originalConsoleError;
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

it('retrieves the languages', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve({
			head: {
				vars: ['item', 'itemLabel', 'language_code', 'native_label'],
			},
			results: {
				bindings: [
					{
						item: {value: 'http://www.wikidata.org/entity/Q1111'},
						itemLabel: {value: 'ZZZ'},
						language_code: {value: 'zz'},
						native_label: {value: 'ZZZ'},
					}, {
						item: {value: 'http://www.wikidata.org/entity/Q2222'},
						itemLabel: {value: 'AAA'},
						language_code: {value: 'aa'},
						native_label: {value: 'AAA'},
					}, {
						item: {value: 'http://www.wikidata.org/entity/Q3333'},
						itemLabel: {value: 'XXX'},
						language_code: {value: 'xx'},
						native_label: {value: ''},
					}, {
						item: {value: 'http://www.wikidata.org/entity/Q4444'},
						itemLabel: {
							value: 1 // not a proper language result
						},
						language_code: {value: 'bb'},
						native_label: {value: 'BBB'},
					},
				],
			},
		}),
		ok: true,
	}));

	const languages = await WikidataInterface.getLanguages();

	expect(languages).toEqual([
		{code: 'aa', label: 'AAA'},
		{code: 'xx', label: 'XXX'},
		{code: 'zz', label: 'ZZZ'},
	]);
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
