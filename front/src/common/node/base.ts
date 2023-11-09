import * as j from "../json";
import * as name from "../name";
import { Position } from "../geometry";

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

// -- Each node type

export type AlphaNodeData = {
	// Literal / Leaf node
	type: NodeType.Alpha;
	val: j.Json;
};

export type BetaNodeData = {
	// Beta reduction node
	type: NodeType.Beta;
	fn?: Source;
	args: Source[];
};

export type DeltaNodeData = {
	// Definition node
	type: NodeType.Delta;
	comment: string;
	ret?: Source;
};

export type LambdaNodeData = {
	// Lambda node
	type: NodeType.Lambda;
	fallback?: Source;
	ret?: Source;
};

export type NuNodeData = {
	// Named app node
	type: NodeType.Nu;
	name: Name;
	lhs: number;
	args: Source[];
};

export type PiNodeData = {
	// Patterned Lambda
	type: NodeType.Pi;
	name: Name;
	pat?: Source;
	elems: number;
};

export type NodeData =
	| AlphaNodeData
	| BetaNodeData
	| DeltaNodeData
	| LambdaNodeData
	| NuNodeData
	| PiNodeData;

export type Node = {
	id: NodeID;
	pos: Position;
	x: NodeData;
};

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
