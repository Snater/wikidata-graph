import Query, {QueryJSON} from '../Query';
import generateSparql from './SparqlGenerator';

const data: QueryJSON = {
	item: 'Q9682',
	property: 'P40',
	mode: Query.MODE.BOTH,
	language: 'en',
	iterations: 5,
	limit: 0,
};

describe('generate()', () => {

	it('throws an error if item is omitted', async () => {
		await expect(generateSparql(
			Object.assign({}, data, {item: undefined})
		)).rejects.toBeTruthy();
	});

	it('throws an error if property is omitted', async () => {
		await expect(generateSparql(
			Object.assign({}, data, {property: undefined})
		)).rejects.toBeTruthy();
	});

	it('returns a string when all data is supplied', async () => {
		const sparql = await generateSparql(data);
		expect(typeof sparql).toStrictEqual('string');
	});

	it('returns a string when only item and property are supplied', async () => {
		const sparql = await generateSparql(Query.newFromJSON(
			Object.assign({}, {item: data.item}, {property: data.property})
		));
		expect(typeof sparql).toStrictEqual('string');
	});

	it('generates a string for mode "both"', async () => {
		const sparql = await generateSparql(Query.newFromJSON(
			Object.assign({}, data, {mode: Query.MODE.BOTH})
		));
		expect(typeof sparql).toStrictEqual('string');
	});

	it('generates a string for mode "forward"', async () => {
		const sparql = await generateSparql(Query.newFromJSON(
			Object.assign({}, data, {mode: Query.MODE.FORWARD})
		));
		expect(typeof sparql).toStrictEqual('string');
	});

	it('generates a string for mode "reverse"', async () => {
		const sparql = await generateSparql(Query.newFromJSON(
			Object.assign({}, data, {mode: Query.MODE.REVERSE})
		));
		expect(typeof sparql).toStrictEqual('string');
	});

	it('generates a string for mode "forward" not using GAS', async () => {
		const sparql = await generateSparql(Object.assign({}, data, {
			mode: Query.MODE.FORWARD,
			iterations: 0,
			limit: 0,
		}));
		expect(typeof sparql).toStrictEqual('string');
	});

	it('generates a string for mode "reverse" not using GAS', async () => {
		const queryJSON = Object.assign({}, data);
		queryJSON.iterations = undefined;
		queryJSON.limit = undefined;

		const sparql = await generateSparql(queryJSON);
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
