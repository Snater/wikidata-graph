import userEvent, {UserEvent} from '@testing-library/user-event';
import ModeSelect from './';
import React from 'react';
import {render} from '../../../jest/utils';

let user: UserEvent;

beforeAll(() => {
	user = userEvent.setup();
});

test('onChange prop', async () => {
	const handleChange = jest.fn();
	const {getByRole, getByText} = render(<ModeSelect id="id" onChange={handleChange} value=""/>);

	await user.click(getByRole('combobox'));
	await user.click(getByText('Reverse'));

	expect(handleChange).toHaveBeenCalledTimes(1);
	expect(handleChange).toHaveBeenCalledWith('Reverse');
});
