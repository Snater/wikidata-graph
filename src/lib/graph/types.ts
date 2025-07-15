import type {Link, Node} from "@/lib/WikidataInterface/WikidataInterface";
import {SparqlEntity} from "@/lib/sparql/types";

export type Graph = {
	nodes: Node[]
	links: Link[]
}

export type GraphRow = {
	item: SparqlEntity
	linkTo: string
	size: number
}
