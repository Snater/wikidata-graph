/**
 * Only defines functionality actually used.
 */
declare module 'd3-v6-tip' {
	export function tip(): {
		(parent: {node: () => SVGElement}): void;
		show(...args: unknown[]): this;
		hide(): this;
		attr(name: string, value: string): this;
		style(name: string): string;
		html(value: string): this;
	};
}
