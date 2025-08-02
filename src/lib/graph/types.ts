import type {EntityId} from 'wikibase-sdk';
import type {SparqlEntity} from "@/lib/sparql/types";

export type Node = {
	id: EntityId
	label: string
	uri: string
	size: number
}

export type Link = {
	source: string
	target: string
}

export type Graph = {
	nodes: Node[]
	links: Link[]
}

export type GraphRow = {
	item: SparqlEntity
	linkTo: string
	size?: number
}
