import { genID } from "../common";
import { SBox, VBox } from "../common/types";

/* Helper Types */

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

/* Node */

export type NodeData = {
	type: Type;
	[key: string]: any;
};

export type NodeUIData = {
	ref?: HTMLElement;
	size?: Size;
	selected: SBox<boolean>;
	position: VBox<Position>;
};

export type NodeP = {
	data: NodeData;
	position: Position;
};

export type Node = NodeP & {
	id: ID;
	ui: NodeUIData;
};

export const emptyNodeUIData = (): NodeUIData => ({
	selected: [false, undefined],
	position: [undefined, undefined],
});

export const substantiateNode = (node: NodeP): Node => ({
	...node,
	id: genID(),
	ui: emptyNodeUIData(),
});

/* Edge */

export type EdgeP = {
	sourceID: ID;
	sourceHandle?: ID;
	targetID: ID;
	targetHandle?: ID;
};

export type EdgeUIData = {
	ref?: HTMLElement;
	selected: SBox<boolean>;
};

export type Edge = EdgeP & {
	id: ID;
	ui: EdgeUIData;
};

export const emptyEdgeUIData = (): EdgeUIData => ({
	selected: [false, undefined],
});

export const substantiateEdge = (edge: EdgeP): Edge => ({
	...edge,
	id: genID(),
	ui: emptyEdgeUIData(),
});

