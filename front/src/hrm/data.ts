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
} from "@/common";

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
export const cBdEmpty = "hrm-c-bd-empty";

/* Symbols */

export const SYM_FALLBACK = "⎇";
export const SYM_FN = "𝑓";
export const SYM_ARG = "𝑥";
export const SYM_RET = "𝑦";
export const SYM_ALPHA = "𝛂";
export const SYM_BETA = "𝛃";
export const SYM_DELTA = "𝚫";
export const SYM_LAMBDA = "𝛌";
export const SYM_NU = "𝛎";
export const SYM_PI = "𝛑";

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
	selected: boolean;
	color?: NodeColor;
	colorClass?: string;
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

export type Nodes = Map<NodeID, VWrap<Node>>;

/* Method */
const sourceHandle = (name: string): VWrap<Handle> =>
	createSignal({
		name: name,
		data: {
			type: HandleType.Source,
			color: randomColor(),
		},
		selected: false,
	});

const sourceToSinkHandle = (name: string, source?: Source): VWrap<Handle> =>
	createSignal({
		name: name,
		data: {
			type: HandleType.Sink,
			sourceID: source?.id,
			sourceHandle: source?.handle,
		},
		selected: false,
	});

export const thawHandles = (node: CNode): Handles => {
	const a: any = [];
	a.lhs = 0;
	const result: Handles = a;
	switch (node.x.type) {
		case NodeType.Alpha:
			break; // No Handles
		case NodeType.Beta:
			{
				result.push(sourceToSinkHandle(SYM_FN, node.x.fn));
				for (const idx in node.x.args) {
					const arg = node.x.args[idx];
					result.push(sourceToSinkHandle(idx, arg));
				}
				result.lhs = 1;
			}
			break;
		case NodeType.Delta:
			result.push(sourceToSinkHandle(SYM_RET, node.x.ret));
			break;
		case NodeType.Lambda:
			result.push(sourceHandle(SYM_ARG));
			result.push(sourceToSinkHandle(SYM_RET, node.x.ret));
			break;
		case NodeType.Nu:
			for (const idx in node.x.args) {
				const arg = node.x.args[idx];
				result.push(sourceToSinkHandle(idx, arg));
			}
			result.lhs = Math.max(0, Math.min(node.x.args.length, node.x.lhs));
			break;
		case NodeType.Pi:
			result.push(sourceToSinkHandle(SYM_FALLBACK, node.x.fallback));
			result.push(sourceHandle(SYM_ARG));
			for (let i = 0; i < node.x.args; i++) {
				result.push(sourceHandle(String(i + 1)));
			}
			result.push(sourceToSinkHandle(SYM_RET, node.x.ret));
			result.lhs = 1;
			break;
	}
	return result;
};

export const thawNodes = (nodes: CNodes): Nodes => {
	const result: Nodes = new Map();
	for (const node of nodes) {
		const thawed: Node = {
			color: randomColor(),
			data: node.x,
			handles: thawHandles(node),
			position: node.pos,
			size: {
				w: 0,
				h: 0,
			},
			selected: false,
		};
		const signal: VWrap<Node> = createSignal(thawed);
		result.set(node.id, signal);
	}
	return result;
};

const freezeSource = (handle: HandleData): Source | undefined => {
	if (handle.type === HandleType.Sink && handle.sourceID !== undefined) {
		return {
			id: handle.sourceID,
			handle: handle.sourceHandle,
		};
	}
};

const freezeNodeData = (node: Node): NodeData => {
	switch (node.data.type) {
		case NodeType.Alpha:
			return node.data;
		case NodeType.Beta: {
			const args: Source[] = [];
			for (let i = 1; i < node.handles.length; i++) {
				const frozen = freezeSource(node.handles[i][0]().data);
				if (frozen) args.push(frozen);
			}
			return {
				type: NodeType.Beta,
				fn: freezeSource(node.handles[0][0]().data),
				args,
			};
		}
		case NodeType.Delta:
			return {
				type: NodeType.Delta,
				comment: node.data.comment,
				ret: freezeSource(node.handles[0][0]().data),
			};
		case NodeType.Lambda:
			return {
				type: NodeType.Lambda,
				ret: freezeSource(node.handles[1][0]().data),
			};
		case NodeType.Nu: {
			const args: Source[] = [];
			for (let i = 0; i < node.handles.length; i++) {
				const frozen = freezeSource(node.handles[i][0]().data);
				if (frozen) args.push(frozen);
			}
			return {
				type: NodeType.Nu,
				name: node.data.name,
				lhs: node.data.lhs,
				args: args,
			};
		}
		case NodeType.Pi:
			return {
				type: NodeType.Pi,
				name: node.data.name,
				args: node.data.args,
				fallback: freezeSource(node.handles[0][0]().data),
				ret: freezeSource(
					node.handles[node.handles.length - 1][0]().data,
				),
			};
	}
};

export const freezeNodes = (nodes: Nodes): CNodes => {
	const result: CNodes = [];
	for (const [id, n] of nodes.entries()) {
		const node = n[0]();
		result.push({
			id: id,
			pos: node.position,
			x: freezeNodeData(node),
		});
	}
	return result;
};

/* Transform */
export type Transform = {
	x: number; // x offset
	y: number; // y offset
	z: number; // zoom
};
