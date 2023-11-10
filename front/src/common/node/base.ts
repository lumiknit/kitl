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
	Beta = "b", // Unnamed app
	Delta = "d", // Definition
	Lambda = "l", // Unpatterned Lambda
	Nu = "n", // Named app
	Pi = "p", // Pattern
}

// Node properties
// Root: The root node of whole tree. Cannot be deleted & has no parent.
export const ROOT_NODES = new Set([NodeType.Delta]);
// Expandable: Able to add handle/edge on the left/right most.
export const LEFT_EXPANDABLE_NODES = new Set([NodeType.Nu]);
export const RIGHT_EXPANDABLE_NODES = new Set([NodeType.Beta, NodeType.Nu]);
// Non-source: Node itself is not a source.
export const NON_SOURCE_NODES = new Set([NodeType.Delta, NodeType.Pi]);

export type Source = {
	id: NodeID;
	handle?: HandleID;
};

const loadSource = (a: any): Source => ({
	id: fassertString(a.id),
	handle: fassertOptional(fassertString)(a.handle),
});

// -- Each node type

export type AlphaNodeData = {
	// Literal / Leaf node
	type: NodeType.Alpha;
	val: j.Json;
};

const loadAlphaNodeData = (d: any): AlphaNodeData => ({
	type: NodeType.Alpha,
	val: d.val,
});

export type BetaNodeData = {
	// Beta reduction node
	type: NodeType.Beta;
	fn?: Source;
	args: Source[];
};

const loadBetaNodeData = (d: any): BetaNodeData => ({
	type: NodeType.Beta,
	fn: fassertOptional(loadSource)(d.fn),
	args: fassertArrayOf(loadSource)(d.args),
});

export type DeltaNodeData = {
	// Definition node
	type: NodeType.Delta;
	comment: string;
	ret?: Source;
};

const loadDeltaNodeData = (d: DeltaNodeData): DeltaNodeData => ({
	type: NodeType.Delta,
	comment: fassertString(d.comment),
	ret: fassertOptional(loadSource)(d.ret),
});

export type LambdaNodeData = {
	// Lambda node
	type: NodeType.Lambda;
	fallback?: Source;
	ret?: Source;
};

const loadLambdaNodeData = (d: LambdaNodeData): LambdaNodeData => ({
	type: NodeType.Lambda,
	fallback: fassertOptional(loadSource)(d.fallback),
	ret: fassertOptional(loadSource)(d.ret),
});

export type NuNodeData = {
	// Named app node
	type: NodeType.Nu;
	name: Name;
	lhs: number;
	args: Source[];
};

const loadNuNodeData = (d: NuNodeData): NuNodeData => ({
	type: NodeType.Nu,
	name: fassertString(d.name),
	lhs: fassertNumber(d.lhs),
	args: fassertArrayOf(loadSource)(d.args),
});

export type PiNodeData = {
	// Patterned Lambda
	type: NodeType.Pi;
	name: Name;
	pat?: Source;
	elems: number;
};

const loadPiNodeData = (d: PiNodeData): PiNodeData => ({
	type: NodeType.Pi,
	name: fassertString(d.name),
	pat: fassertOptional(loadSource)(d.pat),
	elems: fassertNumber(d.elems),
});

export type NodeData =
	| AlphaNodeData
	| BetaNodeData
	| DeltaNodeData
	| LambdaNodeData
	| NuNodeData
	| PiNodeData;

const loadNodeDatas: any = {
	[NodeType.Alpha]: loadAlphaNodeData,
	[NodeType.Beta]: loadBetaNodeData,
	[NodeType.Delta]: loadDeltaNodeData,
	[NodeType.Lambda]: loadLambdaNodeData,
	[NodeType.Nu]: loadNuNodeData,
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

export const emptyGraph = (): Nodes => [
	{
		id: "#def",
		pos: { x: 0, y: 0 },
		x: {
			type: NodeType.Delta,
			comment: "",
		},
	},
];
