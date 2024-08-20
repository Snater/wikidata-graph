/**
 * Only defines functionality actually used.
 */
declare module 'd3-v6-tip' {
	import {Selection} from 'd3';

	export function tip(): {
		(parent: {node: () => SVGElement} | Selection<any, any, any, any>): void;
		show(...args: unknown[]): this;
		hide(): this;
		attr(name: string, value: string): this;
		style(name: string): string;
		html(value: string): this;
	};
}
