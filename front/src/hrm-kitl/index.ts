// Adapter between hrm and kitl

// Connect hrm and kitl

import {
	ValueDef,
	DeltaNodeData,
	Node as KitlNode,
	Nodes as KitlNodes,
	NodeData,
	NodeID,
	NodeType,
	Source,
	VWrap,
	clamp,
	makePositionInt,
	origin,
} from "@/common";
import {
	Handle,
	HandleData,
	HandleType,
	Handles,
	Node as HrmNode,
	Nodes as HrmNodes,
	SYM_ARG,
	SYM_FALLBACK,
	SYM_FN,
	SYM_PAT,
	SYM_RET,
	randomColor,
	resetColor,
} from "@/hrm/data";
import { createSignal } from "solid-js";

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

const thawHandles = (node: KitlNode): Handles => {
	let lhs = 0,
		result: any;
	switch (node.x.type) {
		case NodeType.Alpha:
			result = [];
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
			result = [sourceToSinkHandle(SYM_RET, node.x.val)];
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
			result = [sourceToSinkHandle(SYM_PAT, node.x.pat)];
			for (let i = 0; i < node.x.elems; i++) {
				result.push(sourceHandle(String(i + 1)));
			}
			lhs = 1;
			break;
	}
	result.lhs = lhs;
	return result;
};

export const thawNode = (node: KitlNode): VWrap<HrmNode> =>
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

export const thawNodes = (nodes: KitlNodes): HrmNodes => {
	resetColor();
	const result: HrmNodes = new Map();
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

const freezeNodeData = (node: HrmNode): NodeData => {
	const f = (index: number) => freezeSource(node.handles[index][0]().data);
	switch (node.data.type) {
		case NodeType.Alpha:
			return {
				type: NodeType.Alpha,
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
				val: f(0),
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

export const freezeNode = (id: NodeID, node: HrmNode): KitlNode => ({
	id,
	pos: makePositionInt(node.position),
	x: freezeNodeData(node),
});

export const freezeNodes = (nodes: HrmNodes): KitlNodes => {
	const result: KitlNodes = [];
	for (const [id, n] of nodes.entries()) {
		result.push(freezeNode(id, n[0]()));
	}
	return result;
};

/* Rename handles */

export const renameHandles = (node: HrmNode) => {
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

export const thawValueDef = (d: ValueDef): HrmNodes => {
	// First, thaw the nodes
	const thawed = thawNodes(d.nodes);
	// Create delta node
	const deltaNodeData: DeltaNodeData = {
		type: NodeType.Delta,
		val: d.val,
		comment: d.comment,
	};
	const deltaNode: VWrap<HrmNode> = thawNode({
		id: "#def",
		pos: { ...origin },
		x: deltaNodeData,
	});
	thawed.set("#def", deltaNode);
	return thawed;
};

export const freezeValueDef = (nodes: HrmNodes): ValueDef => {
	// First, freeze the nodes
	const frozen = freezeNodes(nodes);
	// Filter delta type nodes
	const nonDeltaNodes = frozen.filter(n => n.x.type !== NodeType.Delta);
	// Find any delta type node
	const deltaNode = frozen.find(n => n.x.type === NodeType.Delta);
	const valueDef: ValueDef = {
		type: "value",
		nodes: nonDeltaNodes,
		comment: "",
	};
	if (deltaNode) {
		// In this case,
		// 1. Translate all nodes so that the delta node is at origin (0, 0)
		// 2. Set the delta node's data into the valueDef
		for (const node of nonDeltaNodes) {
			node.pos.x -= deltaNode.pos.x;
			node.pos.y -= deltaNode.pos.y;
		}
		valueDef.comment = (deltaNode.x as DeltaNodeData).comment;
		valueDef.val = (deltaNode.x as DeltaNodeData).val;
	}
	return valueDef;
};
