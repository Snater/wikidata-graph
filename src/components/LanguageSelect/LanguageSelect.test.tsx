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

let getLanguagesSpy;

beforeEach(() => {
	getLanguagesSpy = jest.spyOn(Wikidata, 'getLanguages');
	getLanguagesSpy.mockImplementation(async () => [
		{code: 'da', label: 'Dansk'},
		{code: 'de', label: 'Deutsch'},
		{code: 'en', label: 'English'},
	]);
});

afterEach(() => {
	getLanguagesSpy.mockRestore();
});

test('onChange prop', async () => {
	const handleChange = jest.fn();
	const {getByRole, getByText} = render(
		<LanguageSelect id="id" onChange={handleChange} value=""/>
	);

	await waitFor(() => expect(getByRole('combobox')).not.toBeDisabled());

	await user.click(getByRole('combobox'));
	await user.click(getByText('Deutsch'));

	expect(handleChange).toHaveBeenCalledTimes(1);
	expect(handleChange).toHaveBeenCalledWith('de');
});
