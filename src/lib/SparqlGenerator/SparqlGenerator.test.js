import SparqlGenerator from './SparqlGenerator';
import Query from '../Query';

const data = {
	item: 'Q9682',
	property: 'P40',
	mode: Query.MODE.BOTH,
	language: 'en',
	iterations: 5,
	limit: 0,
};

describe('generate()', () => {

	it('throws an error if data is omitted', () => {
		expect(() => SparqlGenerator.generate()).toThrow();
	});

	it('throws an error if item is omitted', () => {
		expect(() => SparqlGenerator.generate(
			Object.assign({}, data, {item: undefined})
		)).toThrow();
	});

	it('throws an error if property is omitted', () => {
		expect(() => SparqlGenerator.generate(
			Object.assign({}, data, {property: undefined})
		)).toThrow();
	});

	it('returns a string when all data is supplied', () => {
		expect(typeof SparqlGenerator.generate(data)).toStrictEqual('string');
	});

	it('returns a string when only item and property are supplied', () => {
		expect(typeof SparqlGenerator.generate(
			Object.assign({}, data, Object.assign({}, {item: data.item}, {property: data.property}))
		)).toStrictEqual('string');
	});

	it('generates a string for mode "both"', () => {
		expect(typeof SparqlGenerator.generate(
			Object.assign({}, data, {mode: Query.MODE.BOTH})
		)).toStrictEqual('string');
	});

	it('generates a string for mode "forward"', () => {
		expect(typeof SparqlGenerator.generate(
			Object.assign({}, data, {mode: Query.MODE.FORWARD})
		)).toStrictEqual('string');
	});

	it('generates a string for mode "reverse"', () => {
		expect(typeof SparqlGenerator.generate(
			Object.assign({}, data, {mode: Query.MODE.REVERSE})
		)).toStrictEqual('string');
	});

	it('generates a string for mode "forward" not using GAS', () => {
		expect(
			typeof SparqlGenerator.generate(Object.assign({}, data, {
				mode: Query.MODE.FORWARD,
				iterations: 0,
				limit: 0,
			}))
		).toStrictEqual('string');
	});

	it('generates a string for mode "reverse" not using GAS', () => {
		expect(
			typeof SparqlGenerator.generate(Object.assign({}, data, {
				mode: Query.MODE.REVERSE,
				iterations: 0,
				limit: 0,
			}))
		).toStrictEqual('string');
	});

	it('throws an error if mode is invalid and GAS should not be used', () => {
		expect(() => SparqlGenerator.generate(Object.assign({}, data, {
			mode: 'invalid',
			iterations: 0,
			limit: 0,
		}))).toThrow();
	});

	it('does not use GAS if iterations and limit are not supplied', () => {
		expect(SparqlGenerator.generate(Object.assign({}, data, {
			iterations: undefined,
			limit: undefined,
		}))).toEqual(expect.not.stringContaining('gas:service'));
	});

	it('does not use GAS if iterations and limit is 0', () => {
		expect(SparqlGenerator.generate(Object.assign({}, data, {
			iterations: 0,
			limit: 0,
		}))).toEqual(expect.not.stringContaining('gas:service'));
	});

	it('uses GAS if iterations is 1', () => {
		expect(SparqlGenerator.generate(Object.assign({}, data, {
			iterations: 1,
			limit: 0,
		}))).toEqual(expect.stringContaining('gas:service'));
	});

	it('uses GAS if limit is 1', () => {
		expect(SparqlGenerator.generate(Object.assign({}, data, {
			iterations: 0,
			limit: 1,
		}))).toEqual(expect.stringContaining('gas:service'));
	});

	it('uses GAS if limit an iterations are 1', () => {
		expect(SparqlGenerator.generate(Object.assign({}, data, {
			iterations: 1,
			limit: 1,
		}))).toEqual(expect.stringContaining('gas:service'));
	});
});
