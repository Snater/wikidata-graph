export type LanguageResult = {
	item: {
		label: string
	}
	language_code: string
	native_label: string
}

export type SparqlRow = Record<string, unknown>

export type SparqlEntity = {
	value: string
	label: string
}
