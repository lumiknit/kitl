import {
	VWrap,
	Position,
	Size,
	NodeID,
	HandleID,
	NodeData,
	Node as CNode,
	Nodes as CNodes,
	NodeType,
	Source,
	clamp,
} from "@/common";
import { PointerID } from "@/common/pointer-helper";

import { JSX, createSignal } from "solid-js";

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
	SYM_DELTA = "𝚫",
	SYM_LAMBDA = "𝛌",
	SYM_NU = "𝛎",
	SYM_PI = "𝛑";

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

/* Method */
const sourceHandle = (name: string): VWrap<Handle> =>
	createSignal({
		name: name,
		data: {
			type: HandleType.Source,
			color: randomColor(),
		},
	});

export const sourceToSinkHandle = (
	name: string,
	source?: Source,
): VWrap<Handle> =>
	createSignal({
		name: name,
		data: {
			type: HandleType.Sink,
			sourceID: source?.id,
			sourceHandle: source?.handle,
		},
	});

const thawHandles = (node: CNode): Handles => {
	let lhs = 0,
		result: any;
	switch (node.x.type) {
		case NodeType.Alpha:
			result = [
				sourceToSinkHandle(SYM_ALPHA, node.x.pat),
			];
			lhs = 1;
			break; // No Handles
		case NodeType.Beta:
			lhs = 1;
			result = [sourceToSinkHandle(SYM_FN, node.x.fn)];
			for (const idx in node.x.args) {
				const arg = node.x.args[idx];
				result.push(sourceToSinkHandle(idx, arg));
			}
			break;
		case NodeType.Delta:
			result = [sourceToSinkHandle(SYM_RET, node.x.ret)];
			break;
		case NodeType.Lambda:
			lhs = 2;
			result = [
				sourceToSinkHandle(SYM_FALLBACK, node.x.fallback),
				sourceHandle(SYM_ARG),
				sourceToSinkHandle(SYM_RET, node.x.ret),
			];
			break;
		case NodeType.Nu:
			result = node.x.args.map((arg, idx) =>
				sourceToSinkHandle(String(idx), arg),
			);
			lhs = clamp(node.x.lhs, 0, node.x.args.length);
			break;
		case NodeType.Pi:
			result = [
				sourceToSinkHandle(SYM_ARG, node.x.pat),
			];
			for (let i = 0; i < node.x.elems; i++) {
				result.push(sourceHandle(String(i + 1)));
			}
			lhs = 1;
			break;
	}
	result.lhs = lhs;
	return result;
};

export const thawNode = (node: CNode): VWrap<Node> =>
	createSignal({
		color: randomColor(),
		angular: node.x.type === NodeType.Alpha,
		data: node.x,
		handles: thawHandles(node),
		position: node.pos,
		size: {
			w: 0,
			h: 0,
		},
		selected: false,
	});

export const thawNodes = (nodes: CNodes): Nodes => {
	resetColor();
	const result: Nodes = new Map();
	for (const node of nodes) {
		result.set(node.id, thawNode(node));
	}
	return result;
};

const freezeSource = (handle: HandleData): Source | undefined => {
	if (handle.type === HandleType.Sink && handle.sourceID) {
		return {
			id: handle.sourceID,
			handle: handle.sourceHandle,
		};
	}
};

const freezeNodeData = (node: Node): NodeData => {
	const f = (index: number) => freezeSource(node.handles[index][0]().data);
	switch (node.data.type) {
		case NodeType.Alpha:
			return {
				type: NodeType.Alpha,
				pat: f(0),
				val: node.data.val,
			};
		case NodeType.Beta: {
			const args: Source[] = [];
			for (let i = 1; i < node.handles.length; i++) {
				const frozen = f(i);
				if (frozen) args.push(frozen);
			}
			return {
				type: NodeType.Beta,
				fn: f(0),
				args,
			};
		}
		case NodeType.Delta:
			return {
				type: NodeType.Delta,
				comment: node.data.comment,
				ret: f(0),
			};
		case NodeType.Lambda:
			return {
				type: NodeType.Lambda,
				fallback: f(0),
				ret: f(2),
			};
		case NodeType.Nu: {
			return {
				type: NodeType.Nu,
				name: node.data.name,
				lhs: node.handles.lhs,
				args: node.handles.reduce<Source[]>((acc, h) => {
					const frozen = freezeSource(h[0]().data);
					if (frozen) acc.push(frozen);
					return acc;
				}, []),
			};
		}
		case NodeType.Pi:
			return {
				type: NodeType.Pi,
				pat: f(0),
				name: node.data.name,
				elems: node.data.elems,
			};
	}
};

export const freezeNode = (id: NodeID, node: Node): CNode => ({
	id,
	pos: node.position,
	x: freezeNodeData(node),
});

export const freezeNodes = (nodes: Nodes): CNodes => {
	const result: CNodes = [];
	for (const [id, n] of nodes.entries()) {
		result.push(freezeNode(id, n[0]()));
	}
	return result;
};

/* Rename handles */

export const renameHandles = (node: Node) => {
	switch (node.data.type) {
		case NodeType.Beta:
			node.handles[0][1](h => ({ ...h, name: SYM_FN }));
			node.handles[0][0]().name = SYM_FN;
			for (let i = 1; i < node.handles.length; i++) {
				node.handles[i][1](h => ({ ...h, name: String(i - 1) }));
			}
			break;
		case NodeType.Nu:
			for (let i = 0; i < node.handles.length; i++) {
				node.handles[i][1](h => ({ ...h, name: String(i) }));
			}
			break;
		default:
			throw "Unimplemented";
	}
};

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
