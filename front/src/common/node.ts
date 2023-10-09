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

// Node properties
// Root: The root node of whole tree. Cannot be deleted & has no parent.
export const ROOT_NODES = new Set([NodeType.Delta]);
// Expandable: Able to add handle/edge on the left/right most.
export const LEFT_EXPANDABLE_NODES = new Set([NodeType.Nu]);
export const RIGHT_EXPANDABLE_NODES = new Set([NodeType.Beta, NodeType.Pi]);

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
	elems: number;
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

// Parser

export const stringifyNodeData = (x: NodeData): string => {
	switch (x.type) {
		case NodeType.Alpha:
			return JSON.stringify(x.val, null, 2);
		case NodeType.Beta:
			return `,${x.args.length}`;
		case NodeType.Delta:
			return `${x.comment}`;
		case NodeType.Lambda:
			return `λ`;
		case NodeType.Nu: {
			const name = x.name;
			const ns = name.module ? `@${name.module}` : "";
			const lhs = x.lhs;
			let rhs = x.args.length - lhs;
			if (rhs < 0) rhs = 0;
			console.log(x.args.length);
			return `${name.name}${ns},${lhs},${rhs}`;
		}
		case NodeType.Pi: {
			const name = x.name;
			const args = x.elems;
			return `λ ${name.name}@${name.module},${args}`;
		}
	}
};

export const parseNodeData = (s: string): NodeData => {
	const trimmed = s.trim();
	// Try to parse as JSON
	try {
		return {
			type: NodeType.Alpha,
			val: JSON.parse(trimmed),
		};
	} catch (e) {
		// Ignore
	}
	// Check the first character
	const first = trimmed[0];
	switch (first) {
		case "λ":
		case "\\": {
			// Lambda or Pi node
			const splitted = trimmed.slice(1).split(","),
				names = splitted[0].split("@");
			if (names[0]) {
				const name = names[0] ? names[0].toString().trim() : "",
					module = names[1] ? names[1].toString().trim() : "";
				let elems = parseInt(splitted[1]);
				if (isNaN(elems)) elems = 0;
				return {
					type: NodeType.Pi,
					name: { name, module },
					elems,
				};
			} else {
				return {
					type: NodeType.Lambda,
				};
			}
		}
		default: {
			// Beta / Nu node
			const splitted = trimmed.split(","),
				names = splitted[0].split("@"),
				name = names[0] ? names[0].toString().trim() : "",
				module = names[1] ? names[1].toString().trim() : "";
			let lhs = parseInt(splitted[1]),
				rhs = parseInt(splitted[2]);
			if (!name) {
				// Beta node
				const args = (isNaN(lhs) ? 0 : lhs) + (isNaN(rhs) ? 0 : rhs);
				return {
					type: NodeType.Beta,
					args: new Array(args).fill({ id: "" }),
				};
			} else {
				if (isNaN(lhs)) lhs = 0;
				if (isNaN(rhs)) {
					rhs = lhs;
					lhs = 0;
				}
				// Nu node
				return {
					type: NodeType.Nu,
					name: { name, module },
					lhs,
					args: new Array(lhs + rhs).fill({ id: "" }),
				};
			}
		}
	}
};
