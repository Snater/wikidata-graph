import {fireEvent, render, waitFor} from '../../../jest/utils';
import useQueryContext, {QueryContextProvider} from '../App/QueryContext';
import QueryManager from './';
import Wikidata from '../../lib/WikidataInterface';

let sparqlQuerySpy;

beforeEach(() => {
	sparqlQuerySpy = jest.spyOn(Wikidata, 'sparqlQuery');
	sparqlQuerySpy.mockImplementation(async () => 'data replacement');
});

afterEach(() => {
	sparqlQuerySpy.mockRestore();
});

function Helper() {
	const {result} = useQueryContext();
	return <>{result}</>;
}

test('emulate popState event', async () => {
	const {container} = render(<QueryContextProvider><QueryManager/><Helper/></QueryContextProvider>);

	fireEvent.popState(window, {
		location: '/?item=Q9682&iterations=5&language=en&limit=0&mode=Both&property=P40&sizeProperty=P3373',
	})

	await waitFor(() => expect(container.textContent).toMatch('data replacement'));
});

test('emulate popState event with new query', async () => {
	const {container} = render(<QueryContextProvider><QueryManager/><Helper/></QueryContextProvider>);

	fireEvent.popState(window, {
		state: {
			item: 'Q43274',
			iterations: 5,
			language: 'en',
			limit: 0,
			mode: 'Both',
			property: 'P40',
			sizeProperty: 'P3373',
		}
	})

	await waitFor(() => expect(container.textContent).toMatch('data replacement'));
});

test('emulate popState on query mismatching to current history state', async () => {
	window.history.replaceState({
		item: 'Q43274',
		iterations: 5,
		language: 'en',
		limit: 0,
		mode: 'Both',
		property: 'P40',
		sizeProperty: 'P3373',
	}, '');

	const {container} = render(<QueryContextProvider><QueryManager/><Helper/></QueryContextProvider>);

	fireEvent.popState(window, {
		state: {
			item: 'Q9682',
			iterations: 5,
			language: 'en',
			limit: 0,
			mode: 'Both',
			property: 'P40',
			sizeProperty: 'P3373',
		}
	})

	await waitFor(() => expect(container.textContent).toMatch('data replacement'));
});

test('initial query string', async () => {
	Object.defineProperty(window, 'location', {
		value: {
			search: '?item=Q9682&iterations=5&language=en&limit=0&mode=Both&property=P40&sizeProperty=P3373',
		}
	});
	const {container} = render(<QueryContextProvider><QueryManager/><Helper/></QueryContextProvider>);
	await waitFor(() => expect(container.textContent).toMatch('data replacement'));
});
