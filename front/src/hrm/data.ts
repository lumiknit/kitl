import { NodeID, HandleID, NodeData } from "@kitl-common/node";

import { VWrap, Position, Size } from "@kitl-common";

import { createSignal } from "solid-js";

/* Const */

export const nodeColors = () =>
	Number(
		window
			.getComputedStyle(document.body)
			.getPropertyValue("--hrm-node-colors-num"),
	);
export const randomColor = () => Math.floor(Math.random() * nodeColors());
export type NodeColor = number;
export const cBg = (color?: NodeColor) =>
	color === undefined ? "" : `hrm-c-bg-${color}`;
export const cBd = (color?: NodeColor) =>
	color === undefined ? "" : `hrm-c-bd-${color}`;
export const cStr = (color?: NodeColor) =>
	color === undefined ? "" : `hrm-c-stroke-${color}`;

/* Handle */

export type SourceHandleData = {
	color: NodeColor;
};

export type Handle = {
	ref?: HTMLElement;
	name: string;
	source?: SourceHandleData; // If undefined, it's not a source
	sourceID?: NodeID;
	sourceHandle?: HandleID;
	selected: boolean;
};

export type Handles = VWrap<Handle>[] & {
	lhs: number;
};

/* Node */

// Node Common

export type Node = {
	ref?: HTMLElement;
	color: NodeColor;
	data: NodeData;
	handles: Handles;
	position: Position;
	size: Size;
	selected: boolean;
};

export type Nodes = Map<Node, NodeID>;

/* Method */
