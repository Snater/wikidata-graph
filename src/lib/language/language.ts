import type {Language} from "@/lib/language/types";
import type {SparqlRow} from '@/lib/sparql/types';
import {isLanguageResult} from '@/lib/sparql/guards'

export function parseLanguages(rows: SparqlRow[]): Language[] {
	return rows
		.filter(isLanguageResult)
		.map((row) => ({
			code: row.language_code,
			label: row.native_label || row.item.label,
		}))
		.sort((a, b) => a.label.localeCompare(b.label));
}
