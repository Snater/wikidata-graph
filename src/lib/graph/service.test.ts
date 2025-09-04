import {runGraphQuery} from '@/lib/graph/service';

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

	const sparqlQuery = await runGraphQuery('imagine some SPARQL query here');

	return expect(sparqlQuery).toEqual({
		nodes: [
			{
				id: 'Q9439',
				label: 'Victoria',
				uri: 'https://www.wikidata.org/entity/Q9439',
				size: 1,
			}, {
				id: 'Q9682',
				label: 'Elizabeth II',
				uri: 'https://www.wikidata.org/entity/Q9682',
				size: 1,
			}, {
				id: 'Q1234',
				label: 'Test Link',
				uri: 'https://www.wikidata.org/entity/Q1234',
				size: 1,
			},
		],
		links: [{
			id: 'Q1234-Q9682',
			source: 'Q1234',
			target: 'Q9682',
		}],
	});
});

it('logs error when SPARQL query failed', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve(),
		ok: false,
	}));

	console.error = jest.fn();

	await runGraphQuery('');

	expect(console.error).toHaveBeenCalledTimes(1);
});
