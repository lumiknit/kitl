import * as j from "../json";
import * as name from "../name";
import { Position, loadPosition } from "../geometry";
import {
	fassertArrayOf,
	fassertNumber,
	fassertOptional,
	fassertString,
} from "../assert";

// -- Helper types

export type Name = name.Name;

export type NodeID = string;
export type HandleID = number;

// -- Node types

export enum NodeType {
	Alpha = "a", // Literal / Leaf node
	Beta = "b", // Application
	Delta = "d", // Root node
	Lambda = "l", // Unpatterned Lambda
	Pi = "p", // Pattern
}

// Node properties
// Root: The root node of whole tree. Cannot be deleted & has no parent.
export const ROOT_NODES = new Set([NodeType.Delta]);
// Expandable: Able to add handle/edge on the left/right most.
export const LEFT_EXPANDABLE_NODES = new Set([NodeType.Beta]);
export const RIGHT_EXPANDABLE_NODES = new Set([NodeType.Beta]);
// Non-source: Node itself is not a source.
export const NON_SOURCE_NODES = new Set([NodeType.Delta, NodeType.Pi]);

export type Source = {
	id: NodeID;
	handle?: HandleID;
};

export const loadSource = (a: any): Source => ({
	id: fassertString(a.id),
	handle: fassertOptional(fassertString)(a.handle),
});

// -- Each node type

export type AlphaNodeData = {
	// Literal / Leaf node
	type: NodeType.Alpha;
	val: j.Json;
	pat?: Source; // Pattern
};

const loadAlphaNodeData = (d: any): AlphaNodeData => ({
	type: NodeType.Alpha,
	val: d.val,
	pat: fassertOptional(loadSource)(d.pat),
});

export type BetaNodeData = {
	// Named app node
	type: NodeType.Beta;
	name: Name;
	lhs: number;
	args: Source[];
};

const loadBetaNodeData = (d: BetaNodeData): BetaNodeData => ({
	type: NodeType.Beta,
	name: name.loadName(d.name),
	lhs: fassertNumber(d.lhs),
	args: fassertArrayOf(loadSource)(d.args),
});

export type DeltaNodeData = {
	// Root node
	type: NodeType.Delta;
	comment: string;
	val?: Source;
};

const loadDeltaNodeData = (d: DeltaNodeData): DeltaNodeData => ({
	type: NodeType.Delta,
	comment: fassertString(d.comment),
	val: fassertOptional(loadSource)(d.val),
});

export type LambdaNodeData = {
	// Lambda node
	type: NodeType.Lambda;
	fallback?: Source;
	params: string[];
	ret?: Source;
};

const loadLambdaNodeData = (d: LambdaNodeData): LambdaNodeData => ({
	type: NodeType.Lambda,
	fallback: fassertOptional(loadSource)(d.fallback),
	params: fassertArrayOf(fassertString)(d.params),
	ret: fassertOptional(loadSource)(d.ret),
});

export type PiNodeData = {
	// Pattern
	type: NodeType.Pi;
	name: Name;
	pat?: Source;
	elems: number;
};

const loadPiNodeData = (d: PiNodeData): PiNodeData => ({
	type: NodeType.Pi,
	name: name.loadName(d.name),
	pat: fassertOptional(loadSource)(d.pat),
	elems: fassertNumber(d.elems),
});

export type NodeData =
	| AlphaNodeData
	| BetaNodeData
	| DeltaNodeData
	| LambdaNodeData
	| PiNodeData;

const loadNodeDatas: any = {
	[NodeType.Alpha]: loadAlphaNodeData,
	[NodeType.Beta]: loadBetaNodeData,
	[NodeType.Delta]: loadDeltaNodeData,
	[NodeType.Lambda]: loadLambdaNodeData,
	[NodeType.Pi]: loadPiNodeData,
};

export type Node = {
	id: NodeID;
	pos: Position;
	x: NodeData;
};

export const loadNode = (n: Node): Node => ({
	id: fassertString(n.id),
	pos: loadPosition(n.pos),
	x: loadNodeDatas[n.x.type](n.x),
});

export type Nodes = Node[];
