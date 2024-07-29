import ModeSelect from './';
import Query from '../../lib/Query';
import React from 'react';
import {fireEvent} from '@testing-library/react';
import {render} from '../../../jest/utils';

test('onChange prop', () => {
	const handleChange = jest.fn();
	const {getAllByRole, getByRole} = render(<ModeSelect id="id" onChange={handleChange} value=""/>);

	fireEvent.mouseDown(getByRole('button'));
	getAllByRole('option')[1].click();

	expect(handleChange).toHaveBeenCalledTimes(1);
	expect(handleChange).toHaveBeenCalledWith(Query.MODE.REVERSE);
});
