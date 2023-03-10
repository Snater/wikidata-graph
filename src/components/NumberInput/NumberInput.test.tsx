import React from 'react';
import NumberInput from './NumberInput';
import {fireEvent, render} from '../../utils/test-utils';

test('Basic rendering', () => {
	const {container} = render(<NumberInput/>);
	expect(container).not.toBeEmptyDOMElement();
});

test('onChange', () => {
	const handleChange = jest.fn();
	const {getByLabelText} = render(<NumberInput label="label" onChange={handleChange}/>);
	fireEvent.change(getByLabelText('label'), {target: {value: '1'}});
	expect(handleChange).toHaveBeenCalledTimes(1);
	expect(handleChange).toHaveBeenCalledWith(1);
});
