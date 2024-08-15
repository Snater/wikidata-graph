import userEvent, {UserEvent} from '@testing-library/user-event';
import Query from '../../lib/Query';
import React from 'react';
import WdqsButton from './';
import {render} from '../../../jest/utils';

const mockedOpen = jest.fn();
let windowSpy;
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
	const {getByRole} = render(<WdqsButton query={new Query('Q123', 'P123')}/>)

	await user.click(getByRole('button'));

	expect(mockedOpen).toHaveBeenCalledTimes(1);
	expect(mockedOpen.mock.calls[0][0]).toMatch('https://query.wikidata.org');
	expect(mockedOpen.mock.calls[0][0]).toMatch('Q123');
	expect(mockedOpen.mock.calls[0][0]).toMatch('P123');
});
