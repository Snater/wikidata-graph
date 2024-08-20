import {EntityId, isEntityId} from 'wikibase-sdk';

export type Mode = 'Forward' | 'Reverse' | 'Both';

export default interface Query {
	item: EntityId
	property: EntityId
	mode: Mode
	language: string
	iterations?: number
	limit?: number
	sizeProperty?: EntityId
}

export function isMode(mode: unknown): mode is Mode {
	const modes: Mode[] = ['Forward', 'Reverse', 'Both'];
	return typeof mode === 'string' && modes.includes(mode as Mode);
}

export function isQuery(query: unknown): query is Query {
	return (
		query !== null && typeof query === 'object'
		&& 'item' in query && typeof query.item === 'string' && isEntityId(query.item)
		&& 'property' in query && typeof query.property === 'string' && isEntityId(query.property)
		&& 'mode' in query && isMode(query.mode)
		&& 'language' in query && typeof query.language === 'string'
		&& 'iterations' in query && typeof query.iterations === 'number'
		&& 'limit' in query && typeof query.limit === 'number'
		&& (
			!('sizeProperty' in query)
			|| typeof query.sizeProperty === 'string' && isEntityId(query.sizeProperty)
		)
	);
}

export function isEqual(queryA: Query, queryB: Query) {
	return (
		queryA.item === queryB.item
		&& queryA.property === queryB.property
		&& queryA.mode === queryB.mode
		&& queryA.language === queryB.language
		&& queryA.iterations === queryB.iterations
		&& queryA.limit === queryB.limit
		&& queryA.sizeProperty === queryB.sizeProperty
	);
}
