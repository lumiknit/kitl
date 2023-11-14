import {
	Node as CNode,
	HandleID,
	NodeData,
	NodeID,
	Position,
	Size,
	VWrap,
} from "@/common";
import { PointerID } from "@/common/pointer-helper";

import { JSX } from "solid-js";

/* Const */

export type NodeColor = number; // Hue
let lastColor = 0;
export const resetColor = () => {
	lastColor = 0;
};
export const randomColor = (): NodeColor =>
	(lastColor = (lastColor + 57.295779513) % 360);

export const cBdEmpty = "hrm-c-bd-empty";

/* Symbols */

export const SYM_FALLBACK = "⎇",
	SYM_FN = "𝑓",
	SYM_ARG = "𝑥",
	SYM_RET = "𝑦",
	SYM_ALPHA = "𝛂",
	SYM_BETA = "𝛃",
	SYM_DELTA = "≝",
	SYM_LAMBDA = "⟾",
	SYM_NU = "𝛎",
	SYM_PI = "↯",
	SYM_PAT = "⧉";

/* Handle */

export enum HandleType {
	Source,
	Sink,
}

export type SourceHandleData = {
	type: HandleType.Source;
	color: NodeColor;
};

export type SinkHandleData = {
	type: HandleType.Sink;
	sourceID?: NodeID;
	sourceHandle?: HandleID;
};

export type HandleData = SourceHandleData | SinkHandleData;

export type Handle = {
	ref?: HTMLElement;
	name: string;
	data: HandleData;
	selected?: boolean;
	color?: NodeColor;
	style?: JSX.CSSProperties;
};

export type Handles = VWrap<Handle>[] & {
	lhs: number;
};

/* Node */

// Node Common

export type Node = {
	ref?: HTMLElement;
	color: NodeColor;
	angular?: boolean;
	data: NodeData;
	handles: Handles;
	position: Position;
	size: Size;
	selected: boolean;
};

export type Nodes = Map<NodeID, VWrap<Node>>;

/* Transform */
export type Transform = {
	x: number; // x offset
	y: number; // y offset
	z: number; // zoom
};

/* Editing Edges */
export type ConnectingEdge = {
	pointerID: PointerID;
	isSource: boolean;
	nodeID: NodeID;
	handleID?: HandleID;
};

export type ConnectingEdgeEnd = {
	pos: Position;
	ref?: HTMLDivElement;
};

export type EditingNode = {
	node: CNode;
	color: NodeColor;
};
