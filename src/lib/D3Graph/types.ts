import {SimulationLinkDatum, SimulationNodeDatum} from 'd3';
import type {GraphNode} from '@/lib/graph/types';
import {Point} from '@/lib/Vector';

export type D3GraphNode = GraphNode & SimulationNodeDatum & {
	radius?: number
}

export type D3GraphLink = SimulationLinkDatum<D3GraphNode> & {
	id: string
	scaledSource?: Point
	scaledTarget?: Point
}
