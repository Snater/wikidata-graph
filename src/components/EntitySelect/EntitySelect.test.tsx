import userEvent, {UserEvent} from '@testing-library/user-event';
import EntitySelect from './';
import React from 'react';
import Wikidata from '../../lib/WikidataInterface';
import {render} from '../../../jest/utils';
import {waitFor} from '@testing-library/react';

let user: UserEvent;

beforeAll(() => {
	user = userEvent.setup();
});

let searchSpy;

beforeEach(() => {
	searchSpy = jest.spyOn(Wikidata, 'search');
	searchSpy.mockImplementation(async () => ({
		search: [
			{id: 'Q1', label: 'Label 1', description: 'Description 1'},
			{id: 'Q2', label: 'Label 2', description: 'Description 2'},
			{id: 'Q3', label: 'Label 3', description: 'Description 3'},
		],
	}));
});

afterEach(() => {
	searchSpy.mockRestore();
});

test('Basic functionality', async () => {
	const {getByDisplayValue, getByRole, getByText} = render(
		<EntitySelect entityId="Q1" entityType="property"/>
	);

	await user.type(getByRole('combobox'), '{arrowdown}');
	await waitFor(() => expect(getByRole('listbox')).toBeInTheDocument());
	await user.click(getByText('Label 2'));

	expect(getByDisplayValue('Label 2')).toBeInTheDocument();
});

test('label prop', async () => {
	const {getByLabelText} = render(
		<EntitySelect entityId="Q1" entityType="property" label="Label 1"/>
	);

	expect(getByLabelText('Label 1')).toBeInTheDocument();
});

test('onChange prop', async () => {
	const handleChange = jest.fn();
	const {getByRole, getByText} = render(
		<EntitySelect entityId="Q1" entityType="property" onChange={handleChange}/>
	);

	await user.type(getByRole('combobox'), '{arrowdown}');
	await waitFor(() => expect(getByRole('listbox')).toBeInTheDocument());
	await user.click(getByText('Label 2'));

	expect(handleChange).toHaveBeenCalledTimes(2);
	expect(handleChange).toHaveBeenCalledWith('Q1');
});
