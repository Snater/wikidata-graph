import type {EntityId} from 'wikibase-sdk';
import type {SparqlEntity} from "@/lib/sparql/types";

export type GraphNode = {
	id: EntityId
	label: string
	uri: string
	size: number
}

export type GraphLink = {
	id: string
	source: string
	target: string
}

export type Graph = {
	nodes: GraphNode[]
	links: GraphLink[]
}

export type GraphRow = {
	item: SparqlEntity
	linkTo: string
	size?: number
}
