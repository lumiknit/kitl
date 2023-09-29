import * as j from "./json";
import * as name from "./name";
import { Position } from "./geometry";

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
	Pi = "p", // Patterned Lambda
}

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
	args: number;
	fallback?: Source;
	ret?: Source;
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
