import type {LanguageRow} from '@/lib/language/types';
import type {SparqlEntity} from '@/lib/sparql/types';

export function isString(value: unknown): value is string {
	return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
	return typeof value === 'number';
}

export function isSparqlEntity(value: unknown): value is SparqlEntity {
	return hasString(value, 'value', 'label');
}

export function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

export function hasString<K extends string>(value: unknown, ...keys: K[]): value is Record<K, string> {

	if (!isObject(value)) {
		return false;
	}

	for (const key of keys) {
		if (typeof value[key] !== 'string') {
			return false;
		}
	}

	return true;
}

export function isLanguageRow(result: unknown): result is LanguageRow {
	return (
		isObject(result)
		&& 'item' in result
		&& isObject(result.item)
		&& hasString(result.item, 'label')
		&& hasString(result, 'language_code', 'native_label')
	);
}
