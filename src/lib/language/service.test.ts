import {getLanguages} from '@/lib/language/service';

const originalFetch = global.fetch;
const originalConsoleError = console.error;

afterEach(() => {
	global.fetch = originalFetch;
	console.error = originalConsoleError;
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

	const languages = await getLanguages();

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

	await getLanguages();

	expect(console.error).toHaveBeenCalledTimes(1);
});
