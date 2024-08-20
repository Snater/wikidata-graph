import Query from '../Query';
import generateSparql from './SparqlGenerator';

const data: Query = {
	item: 'Q9682',
	property: 'P40',
	mode: 'Both',
	language: 'en',
	iterations: 5,
	limit: 0,
};

describe('generate()', () => {

	it('returns a string when all data is supplied', async () => {
		const sparql = await generateSparql(data);
		expect(typeof sparql).toStrictEqual('string');
	});

	it('generates a string for mode "both"', async () => {
		const sparql = await generateSparql(Object.assign({}, data, {mode: 'Both'}));
		expect(typeof sparql).toStrictEqual('string');
	});

	it('generates a string for mode "forward"', async () => {
		const sparql = await generateSparql(Object.assign({}, data, {mode: 'Forward'}));
		expect(typeof sparql).toStrictEqual('string');
	});

	it('generates a string for mode "reverse"', async () => {
		const sparql = await generateSparql(Object.assign({}, data, {mode: 'Reverse'}));
		expect(typeof sparql).toStrictEqual('string');
	});

	it('generates a string for mode "forward" not using GAS', async () => {
		const sparql = await generateSparql(Object.assign({}, data, {
			mode: 'Forward',
			iterations: 0,
			limit: 0,
		}));
		expect(typeof sparql).toStrictEqual('string');
	});

	it('generates a string for mode "reverse" not using GAS', async () => {
		const query = Object.assign({}, data);
		query.iterations = undefined;
		query.limit = undefined;

		const sparql = await generateSparql(query);
		expect(typeof sparql).toStrictEqual('string');
	});

	it('throws an error if mode is invalid and GAS should not be used', async () => {
		await expect(generateSparql(Object.assign({}, data, {
			mode: 'invalid',
			iterations: 0,
			limit: 0,
		}))).rejects.toBeTruthy();
	});

	it('does not use GAS if iterations and limit are not supplied', async () => {
		const sparql = await generateSparql(Object.assign({}, data, {
			iterations: 0,
			limit: 0,
		}));

		expect(sparql).toEqual(expect.not.stringContaining('gas:service'));
	});

	it('does not use GAS if iterations and limit is 0', async () => {
		const sparql = await generateSparql(Object.assign({}, data, {
			iterations: 0,
			limit: 0,
		}));

		expect(sparql).toEqual(expect.not.stringContaining('gas:service'));
	});

	it('uses GAS if iterations is 1', async () => {
		const sparql = await generateSparql(Object.assign({}, data, {
			iterations: 1,
			limit: 0,
		}));

		expect(sparql).toEqual(expect.stringContaining('gas:service'));
	});

	it('uses GAS if limit is 1', async () => {
		const sparql = await generateSparql(Object.assign({}, data, {
			iterations: 0,
			limit: 1,
		}));

		expect(sparql).toEqual(expect.stringContaining('gas:service'));
	});

	it('uses GAS if limit an iterations are 1', async () => {
		const sparql = await generateSparql(Object.assign({}, data, {
			iterations: 1,
			limit: 1,
		}));

		expect(sparql).toEqual(expect.stringContaining('gas:service'));
	});
});
