import {getEntityImage} from '@/lib/wikidata/image';

const originalImage = Image;
const originalFetch = global.fetch;
const originalConsoleError = console.error;

afterEach(() => {
	global.fetch = originalFetch;
	console.error = originalConsoleError;
});

beforeAll(() => {
	global.Image = class {
		onload: () => void;

		constructor() {
			this.onload = jest.fn();
			setTimeout(() => {
				this.onload();
			}, 50);
		}
	} as unknown as typeof originalImage;
});

afterAll(() => {
	global.Image = originalImage;
});

it('retrieves an entity image', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve({
			entities: {
				Q6789: {
					claims: {
						P18: [{
							mainsnak: {
								datavalue: {value: 'image_URL_placeholder'},
								datatype: 'commonsMedia'
							},
						}],
					},
				},
			},
		}),
		ok: true,
	}));

	const image = await getEntityImage('Q6789');

	expect(image).toBeInstanceOf(Image);
	expect(image.src).toContain('/image_URL_placeholder/');
});

it('fails retrieving image when value\'s data type is not a string', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve({
			entities: {
				Q2345: {
					claims: {
						P18: [{
							mainsnak: {
								datavalue: {value: 123},
								datatype: 'commonsMedia'
							},
						}],
					},
				},
			},
		}),
		ok: true,
	}));

	const image = await getEntityImage('Q2345');

	expect(image).toBeInstanceOf(Image);
	expect(image.src).toContain('No_image_available');
});

it('fails retrieving image when no claim to retrieve Commons image from', async () => {
	global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
		json: () => Promise.resolve({
			entities: {Q9876: {}},
		}),
		ok: true,
	}));

	const image = await getEntityImage('Q9876');

	expect(image).toBeInstanceOf(Image);
	expect(image.src).toContain('No_image_available');
});