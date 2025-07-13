import { LanguageResult } from "@/lib/sparql/types";

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

export function isLanguageResult(result: unknown): result is LanguageResult {
	return (
		isObject(result)
		&& 'item' in result
		&& isObject(result.item)
		&& hasString(result.item, 'label')
		&& hasString(result, 'language_code', 'native_label')
	);
}