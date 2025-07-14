import { isNumber, isSparqlEntity, isString } from './guards'
import type { SparqlEntity, SparqlRow } from "@/lib/sparql/types";

function getValue<T>(
	row: SparqlRow,
	key: string,
	guard: (value: unknown) => value is T
): T | undefined {
	const value = row[key]

	return guard(value) ? value : undefined;
}

export function getString(row: SparqlRow, key: string) {
	return getValue(row, key, isString);
}

export function getNumber(row: SparqlRow, key: string) {
	return getValue(row, key, isNumber);
}

export function getEntity(row: SparqlRow, key: string): SparqlEntity | undefined {
	return getValue(row, key, isSparqlEntity);
}