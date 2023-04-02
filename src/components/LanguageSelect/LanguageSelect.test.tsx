import {fireEvent, waitFor} from '@testing-library/react';
import LanguageSelect from './';
import React from 'react';
import Wikidata from '../../lib/WikidataInterface';
import {render} from '../../utils/test-utils';

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
	const {getAllByRole, getByRole} = render(
		<LanguageSelect id="id" onChange={handleChange} value=""/>
	);

	await waitFor(() => expect(getByRole('button')).not.toBeDisabled());

	fireEvent.mouseDown(getByRole('button'));
	getAllByRole('option')[1].click();

	expect(handleChange).toHaveBeenCalledTimes(1);
	expect(handleChange).toHaveBeenCalledWith('de');
});