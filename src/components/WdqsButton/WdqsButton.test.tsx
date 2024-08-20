import userEvent, {UserEvent} from '@testing-library/user-event';
import Query from '../../lib/Query';
import React from 'react';
import WdqsButton from './';
import {render} from '../../../jest/utils';

const mockedOpen = jest.fn();
let windowSpy: jest.SpyInstance;
let user: UserEvent;

beforeAll(() => {
	user = userEvent.setup();
})

beforeEach(() => {
	windowSpy = jest.spyOn(window, 'open');
	windowSpy.mockImplementation(mockedOpen);
});

afterEach(() => {
	windowSpy.mockRestore();
});

test('basic', async () => {
	const queryMock: Query = {
		item: 'Q123',
		property: 'P123',
		mode: 'Both',
		language: 'en',
		iterations: 5,
		limit: 0,
		sizeProperty: 'P456',
	};

	const {getByRole} = render(<WdqsButton query={queryMock}/>);

	await user.click(getByRole('button'));

	expect(mockedOpen).toHaveBeenCalledTimes(1);
	expect(mockedOpen.mock.calls[0][0]).toMatch('https://query.wikidata.org');
	expect(mockedOpen.mock.calls[0][0]).toMatch('Q123');
	expect(mockedOpen.mock.calls[0][0]).toMatch('P123');
});
