import {fireEvent, waitFor} from '@testing-library/react';
import React from 'react';
import Wikidata from '../../lib/WikidataInterface';
import {render} from '../../utils/test-utils';
import EntitySelect from './';

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
	const {getAllByRole, getByDisplayValue, getByRole} = render(
		<EntitySelect entityId="Q1" entityType="property"/>
	);

	const input = getByRole('combobox');
	fireEvent.keyDown(input, {key: 'ArrowDown'});
	await waitFor(() => expect(getByRole('listbox')).toBeInTheDocument());
	getAllByRole('option')[1].click();

	expect(getByDisplayValue('Label 3')).toBeInTheDocument();
});

test('label prop', async () => {
	const {getByLabelText} = render(
		<EntitySelect entityId="Q1" entityType="property" label="Label 1"/>
	);

	expect(getByLabelText('Label 1')).toBeInTheDocument();
});

test('onChange prop', async () => {
	const handleChange = jest.fn();
	const {getAllByRole, getByRole} = render(
		<EntitySelect entityId="Q1" entityType="property" onChange={handleChange}/>
	);

	const input = getByRole('combobox');
	fireEvent.keyDown(input, {key: 'ArrowDown'});
	await waitFor(() => expect(getByRole('listbox')).toBeInTheDocument());
	fireEvent.keyDown(input, {key: 'ArrowDown'});
	getAllByRole('option')[1].click();

	expect(handleChange).toHaveBeenCalledTimes(1);
	expect(handleChange).toHaveBeenCalledWith('Q1');
});