import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import NumberInput from './NumberInput';

it('renders correctly without props', () => {
	const rendered = renderer.create(<NumberInput />).toJSON();
	expect(rendered).toMatchSnapshot()
});

it('renders correctly with label', () => {
	const rendered = renderer.create(<NumberInput label="label" />).toJSON();
	expect(rendered).toMatchSnapshot()
});

it('renders default value', () => {
	const rendered = renderer.create(<NumberInput defaultValue={99} />).toJSON();
	expect(rendered).toMatchSnapshot()
});

it('passes integer on change', () => {
	const mockChangeCallback = jest.fn(value => value);
	const wrapper = mount(<NumberInput onChange={mockChangeCallback} />);
	wrapper.find('input').simulate('change',  {target: {value: '79'}});
	expect(mockChangeCallback.mock.results[0].value).toEqual(79);
});
