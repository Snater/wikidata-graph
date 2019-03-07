import React from 'react';
import renderer from 'react-test-renderer';
import { mount, shallow } from 'enzyme';
import NumberInput from './NumberInput';

it('contains only an input element', () => {
	const wrapper = shallow(<NumberInput />);
	expect(wrapper.find('input').equals(wrapper.get(0))).toEqual(true);
});

it('renders correctly', () => {
	const rendered = renderer.create(<NumberInput />).toJSON();
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