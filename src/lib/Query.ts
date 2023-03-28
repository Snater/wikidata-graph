import {EntityId} from 'wikibase-sdk/dist/types/entity';

export interface QueryJSON {
	item: string
	property: string
	mode: string
	language?: string
	iterations?: number | string
	limit?: number | string
	sizeProperty?: string
}

export default class Query {

	static MODE = {
		FORWARD: 'Forward',
		REVERSE: 'Reverse',
		BOTH: 'Both',
	};

	public item: EntityId;
	public property: EntityId;
	public mode: string;
	public language?: string;
	public iterations?: number;
	public limit?: number;
	public sizeProperty?: EntityId;

	static newFromJSON = (json: QueryJSON) => {
		return new Query(
			json.item as EntityId,
			json.property as EntityId,
			json.mode,
			json.language,
			typeof json.iterations === 'string' ? parseInt(json.iterations) : json.iterations,
			typeof json.limit === 'string' ? parseInt(json.limit) : json.limit,
			json.sizeProperty as EntityId,
		)
	}

	constructor(
		item: EntityId,
		property: EntityId,
		mode = Query.MODE.BOTH,
		language = 'en',
		iterations = 5,
		limit = 0,
		sizeProperty?: EntityId | undefined,
	) {
		if (!item || !property) {
			throw new Error('Item and property are required');
		}

		this.item = item;
		this.property = property;
		this.mode = mode;
		this.language = language;
		this.iterations = iterations;
		this.limit = limit;
		this.sizeProperty = sizeProperty;
	}

	equals = (query: Query) => {
		return query.item === this.item
			&& query.property === this.property
			&& query.mode === this.mode
			&& query.language === this.language
			&& query.iterations === this.iterations
			&& query.limit === this.limit
			&& query.sizeProperty === this.sizeProperty;
	}

	toJSON = (): QueryJSON => {
		return {
			item: this.item,
			property: this.property,
			mode: this.mode,
			language: this.language,
			iterations: this.iterations,
			limit: this.limit,
			sizeProperty: this.sizeProperty || '',
		};
	}
}