import { genID } from "../common";
import { SBox, VBox } from "../common/types";

/* Graph data */

export type ID = string;
export type Type = string;

export type Position = {
	x: number;
	y: number;
};

export type Size = {
	w: number;
	h: number;
};

export type NodeData = {
	type: Type;
	[key: string]: any;
};

export type NodeUIData = {
	ref?: any;
	size?: Size;
	selected: SBox<boolean>;
	position: VBox<Position>;
};

export const emptyNodeUIData = (): NodeUIData => ({
	selected: [false, undefined],
	position: [undefined, undefined],
});

export type NodeP = {
	data: NodeData;
	position: Position;
};

export type Node = NodeP & {
	id: ID;
	ui: NodeUIData;
};

export const substantiateNode = (node: NodeP): Node => ({
	...node,
	id: genID(),
	ui: emptyNodeUIData(),
});

export type EdgeP = {
	sourceID: ID;
	sourceHandle?: ID;
	targetID: ID;
	targetHandle?: ID;
};

export type Edge = EdgeP & {
	id: ID;
};

export const substantiateEdge = (edge: EdgeP): Edge => ({
	...edge,
	id: genID(),
});

/* View data */
export type View = {
	pan: Position;
	zoom: number;
};
