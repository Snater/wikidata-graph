import {Claims, EntityId, Item, PropertyClaims} from 'wikibase-sdk';
import MD5 from 'md5';
import {getEntity} from '@/lib/wikidata/client';

const IMAGE_FALLBACK = 'No_image_available_500_x_500.svg';

export function getEntityImage(id: EntityId): Promise<HTMLImageElement> {
	return new Promise(resolve => {
		getEntity(id)
			.then(entity => {
				const item = entity as Item;
				return resolve(createImage(item.claims));
			});
	});
}

function createImage(claims?: Claims): Promise<HTMLImageElement> {
	const img = new Image();
	const imgUrl = getImageUrl(claims?.P18);

	return new Promise(resolve => {
		img.onload = () => resolve(img);
		img.alt = '';
		img.src = imgUrl;
	});
}

function getImageUrl(propertyClaims?: PropertyClaims) {
	const mainsnak = propertyClaims?.[0]?.mainsnak;

	if (mainsnak?.datatype === 'commonsMedia') {
		const value = mainsnak.datavalue?.value;

		if (typeof value === 'string') {
			return createCommonsUrl(value.replace(/ /g, '_'));
		}
	}

	return createCommonsUrl(IMAGE_FALLBACK);
}

function createCommonsUrl(filename: string) {
	const md5 = MD5(filename);
	const extension = filename.endsWith('.svg') ? '.png' : '';
	return `https://upload.wikimedia.org/wikipedia/commons/thumb/${md5[0]}/${md5[0]}${md5[1]}/${filename}/60px-${filename}${extension}`;
}
