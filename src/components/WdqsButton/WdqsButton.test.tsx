import Query from '../../lib/Query';
import WdqsButton from './';
import {render} from '../../utils/test-utils';

const mockedOpen = jest.fn();
let windowSpy;

beforeEach(() => {
	windowSpy = jest.spyOn(window, 'open');
	windowSpy.mockImplementation(mockedOpen);
});

afterEach(() => {
	windowSpy.mockRestore();
});

test('basic', () => {
	const {getByRole} = render(<WdqsButton query={new Query('Q123', 'P123')}/>)

	getByRole('button').click();

	expect(mockedOpen).toHaveBeenCalledTimes(1);
	expect(mockedOpen.mock.calls[0][0]).toMatch('https://query.wikidata.org');
	expect(mockedOpen.mock.calls[0][0]).toMatch('Q123');
	expect(mockedOpen.mock.calls[0][0]).toMatch('P123');
});