import { genID } from "../common";

/* Graph data */

export type ID = string;
export type Type = string;

export type Position = {
	x: number;
	y: number;
};

export type Size = {
	width: number;
	height: number;
};

export type NodeData = {
	type: Type;
	[key: string]: any;
};

export type NodeUIData = {
	size?: Size;
	selected: boolean;
};

export const emptyNodeUIData = (): NodeUIData => ({
	selected: false,
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
