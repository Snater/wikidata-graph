import {querySparql} from '@/lib/wikidata/client';
import type {SparqlRow} from '@/lib/sparql/types';
import type {Language} from '@/lib/language/types';
import {isLanguageRow} from '@/lib/sparql/guards';

export const LANGUAGE_QUERY = `
	SELECT ?item ?itemLabel ?language_code (SAMPLE(?native_label) AS ?native_label) WHERE {
		?item wdt:P424 ?language_code.
		?item wdt:P218 ?iso_code.
		OPTIONAL { ?item wdt:P1705 ?native_label. }
		SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
	}
	GROUP BY ?item ?itemLabel ?language_code
	ORDER BY ?itemLabel ?item
`;

function parseLanguages(rows: SparqlRow[]): Language[] {
	return rows
		.filter(isLanguageRow)
		.map((row) => ({
			code: row.language_code,
			label: row.native_label || row.item.label,
		}))
		.sort((a, b) => a.label.localeCompare(b.label));
}

export async function getLanguages() {
	try {
		const results = await querySparql(LANGUAGE_QUERY);
		return parseLanguages(results);
	} catch (error) {
		console.error(error);
	}

	return [];
}
