import type {Language} from "@/lib/language/types";
import type {SparqlResults} from 'wikibase-sdk'
import {isLanguageResult} from '@/lib/sparql/guards'
import {simplify} from 'wikibase-sdk';

export function parseLanguages(result: SparqlResults): Language[] {
	return simplify
		.sparqlResults(result)
		.map((row) => {
			if (!isLanguageResult(row)) {
				return null;
			}

			return {
				code: row.language_code,
				label: row.native_label || row.item.label,
			};
		})
		.filter((l): l is Language => l !== null)
		.sort((a, b) => a.label.localeCompare(b.label));
}
