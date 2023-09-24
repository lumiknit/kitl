import { genID } from "../common";
import { SBox, VBox } from "../common/types";

/* Helper Types */

export type ID = string;
export type HandleID = number;
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

export type Handle = {
	name: string;
	sourceID?: ID;
	sourceHandle?: HandleID;
};

export type HandleData = {
	items: Handle[];
	lhs: number; // Number of handles at lhs
};

export type HandleUIData = {
	ref?: HTMLElement;
	selected: SBox<boolean>;
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
	handles: HandleData;
};

export type Node = NodeP & {
	id: ID;
	ui: NodeUIData;
	hui: HandleUIData[];
};

export const emptyNodeUIData = (): NodeUIData => ({
	selected: [false, undefined],
	position: [undefined, undefined],
});

export const substantiateNode = (node: NodeP): Node => ({
	...node,
	id: genID(),
	ui: emptyNodeUIData(),
	hui: [],
});
