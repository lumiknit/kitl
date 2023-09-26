import { VWrap } from "../common/types";

import { createSignal } from "solid-js";

/* Helper Types */

export type ID = string;
export type HandleID = number;
export type Type = string;

export type WithID = {
	id: ID;
};

export type Position = {
	x: number;
	y: number;
};

export type Size = {
	w: number;
	h: number;
};

/* Handle */

// Handle Common
export type HandleC = {
	name: string;
	sourceID?: ID;
	sourceHandle?: HandleID;
};

export type HandleUI = {
	ref?: HTMLElement;
	selected: boolean;
};

// Handle (for UI, solidjs)
export type Handle = HandleC & HandleUI;
export type Handles = {
	lhs: number;
	items: VWrap<Handle>[];
};
export type WithHandles = {
	handles: Handles;
};

// Handle (frozen, for serialization)
export type HandleF = HandleC;
export type HandlesF = {
	lhs: number;
	items: HandleF[];
};
export type WithHandlesF = {
	handles: HandlesF;
};

/* Node */

export type NodeData = {
	type: Type;
	[key: string]: any;
};

// Node Common
export type NodeC = {
	data: NodeData;
	position: Position;
};

export type NodeUI = {
	ref?: HTMLElement;
	size: Size;
	selected: boolean;
};

// Node (for UI, solidjs)
export type Node = NodeC & NodeUI & WithHandles;
export type Nodes = Map<string, VWrap<Node>>;

// Node (frozen, for serialization)
export type NodeF = WithID & NodeC & WithHandlesF;
export type NodesF = NodeF[];

/* Method */

// Thaw
export const thawHandles = (handles: HandlesF): Handles => {
	const thawed = [];
	for (const handle of handles.items) {
		const vw = createSignal<Handle>({
			...handle,
			ref: undefined,
			selected: false,
		});
		thawed.push(vw);
	}
	return {
		lhs: handles.lhs,
		items: thawed,
	};
};

export const thawNodes = (nodes: NodesF): Nodes => {
	const thawed = new Map();
	for (const node of nodes) {
		const vw = createSignal<Node>({
			...node,
			ref: undefined,
			size: {
				w: 0,
				h: 0,
			},
			selected: false,
			handles: thawHandles(node.handles),
		});
		thawed.set(node.id, vw);
	}
	return thawed;
};

// Freeze

export const freezeHandles = (handles: Handles): HandlesF => {
	const frozen = [];
	for (const handle of handles.items) {
		const h = handle[0]();
		frozen.push({
			name: h.name,
			sourceID: h.sourceID,
			sourceHandle: h.sourceHandle,
		});
	}
	return {
		lhs: handles.lhs,
		items: frozen,
	};
};

export const freezeNodes = (nodes: Nodes): NodesF => {
	const frozen = [];
	for (const [id, node] of nodes) {
		const n = node[0]();
		frozen.push({
			id,
			data: n.data,
			position: n.position,
			handles: freezeHandles(n.handles),
		});
	}
	return frozen;
};
