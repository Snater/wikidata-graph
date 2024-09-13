import userEvent, {UserEvent} from '@testing-library/user-event';
import LanguageSelect from './';
import React from 'react';
import Wikidata from '../../lib/WikidataInterface';
import {render} from '../../../jest/utils';
import {waitFor} from '@testing-library/react';

let user: UserEvent;

beforeAll(() => {
	user = userEvent.setup();
});

let getLanguagesSpy: jest.SpyInstance;

beforeEach(() => {
	getLanguagesSpy = jest.spyOn(Wikidata, 'getLanguages');
});

afterEach(() => {
	getLanguagesSpy.mockRestore();
});

it('triggers onChange event', async () => {
	getLanguagesSpy.mockImplementation(async () => [
		{code: 'da', label: 'Dansk'},
		{code: 'de', label: 'Deutsch'},
		{code: 'en', label: 'English'},
	]);

	const handleChange = jest.fn();
	const {getByRole, getByText} = render(<LanguageSelect id="id" onChange={handleChange} value=""/>);

	await waitFor(() => expect(getByRole('combobox')).not.toBeDisabled());

	await user.click(getByRole('combobox'));
	await user.click(getByText('Deutsch'));

	expect(handleChange).toHaveBeenCalledTimes(1);
	expect(handleChange).toHaveBeenCalledWith('de');
});

it('remains empty when not languages are retrieved', async () => {
	const mock = jest.fn(() => null);
	getLanguagesSpy.mockImplementation(async () => mock());

	const {getByRole} = render(<LanguageSelect id="id" native onChange={jest.fn} value=""/>);

	expect(mock).toHaveBeenCalledTimes(1);

	expect(getByRole('combobox')).toBeDisabled();
});
