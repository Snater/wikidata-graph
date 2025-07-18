import {getEntity, searchEntities} from '@/lib/wikidata/client';

const originalFetch = global.fetch;
const originalConsoleError = console.error;

afterEach(() => {
	global.fetch = originalFetch;
	console.error = originalConsoleError;
});

it('retrieves an entity', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve({entities: {Q1: 'getEntity() result'}}),
		ok: true,
	}));

	const response = await getEntity('Q1');
	expect(response).toEqual('getEntity() result');
});

it('retrieves an entity from the cache', async () => {
	const fetchMock = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve({entities: {Q4839: 'getEntity() result'}}),
		ok: true,
	}));

	global.fetch = fetchMock;

	const response = await getEntity('Q4839');
	expect(response).toEqual('getEntity() result');

	const response2 = await getEntity('Q4839');
	expect(response2).toEqual('getEntity() result');

	expect(fetchMock).toHaveBeenCalledTimes(1);
});

it('throws an error when unable to retrieve an entity', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve(),
		ok: false,
	}));

	await expect(getEntity('Q999')).rejects.toBeTruthy();
});

it('triggers a request when searching for entities', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve('search() result'),
		ok: true,
	}));

	const results = await searchEntities('imagine some search request here');

	expect(results).toBe('search() result');
});

it('appends "property" parameter to the query string when searching for a property', () => {
	global.fetch = jest.fn().mockImplementation((url: string) => Promise.resolve({
		json: () => Promise.resolve(url),
		ok: true,
	}));

	return searchEntities('search string', 'property')
		.then(url => {
			expect(url).toEqual(expect.stringContaining('&type=property'));
		});
});
