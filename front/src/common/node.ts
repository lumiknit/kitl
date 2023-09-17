import * as j from "./json";
import * as name from "./name";

// -- Helper types

export type Name = name.Name;

export type NodeID = string;
export type HandleID = string;

export type EdgeSource = {
	nodeID: NodeID;
	handleID: HandleID;
};

// -- Node types

export enum NodeType {
	Def = "def",
	Literal = "literal",
	Beta = "beta",
	Lambda = "lambda",
	Comment = "comment",
}

// -- Common handle

export const HANDLE_VAL = "val";

// -- Each node type

// Literal
export type LiteralNodeData = {
	type: NodeType.Literal;
	value: j.Json;
};

// Beta

export enum BetaNodeType {
	App,
	Name,
}

export type BetaAppNodeData = {
	type: NodeType.Beta;
	betaType: BetaNodeType.App;
	argc: number;
};

export type BetaNameNodeData = {
	type: NodeType.Beta;
	betaType: BetaNodeType.Name;
	name: Name;
	argc: number;
};

export type BetaNodeData = BetaAppNodeData | BetaNameNodeData;

export const HANDLE_BETA_ARG_PREFIX = "arg-";
export const handleBetaArg = (i: number) => `${HANDLE_BETA_ARG_PREFIX}${i}`;
export const HANDLE_BETA_FUN = "fun";

export const emptyBetaNode = (): BetaNodeData => ({
	type: NodeType.Beta,
	betaType: BetaNodeType.App,
	argc: 0,
});

// Lambda

export enum LambdaNodeType {
	Pattern,
	Any,
}

export type LambdaPatternNodeData = {
	type: NodeType.Lambda;
	lambdaType: LambdaNodeType.Pattern;
	pattern: Name;
	argc: number;
};

export type LambdaAnyNodeData = {
	type: NodeType.Lambda;
	lambdaType: LambdaNodeType.Any;
};

export type LambdaNodeData = LambdaPatternNodeData | LambdaAnyNodeData;

export const HANDLE_LAMBDA_ARG = "arg";
export const HANDLE_LAMBDA_PARAM = "param";
export const HANDLE_LAMBDA_ELEM_PREFIX = "elem-";
export const handleLambdaElem = (i: number) =>
	`${HANDLE_LAMBDA_ELEM_PREFIX}${i}`;
export const HANDLE_LAMBDA_RET = "ret";

// Comment

export type CommentNodeData = {
	type: NodeType.Comment;
	content: string;
};

// Def

export type DefNodeData = {
	type: NodeType.Def;
};

export const HANDLE_DEF_ARG = "arg";

export const DEF_NODE_ID = "##def";

// Node Data

export type NodeData =
	| LiteralNodeData
	| BetaNodeData
	| LambdaNodeData
	| CommentNodeData
	| DefNodeData;

export type Node = {
	id: string;
	data: NodeData;
	edges: { [key: HandleID]: EdgeSource };
};

// Helpers

export const cloneNodeData = (nodeData: NodeData): NodeData => {
	// Clone the node and remove all unused properties
	switch (nodeData.type) {
		case NodeType.Beta:
			if (nodeData.betaType === BetaNodeType.Name) {
				return {
					...nodeData,
					name: name.cloneName(nodeData.name),
				};
			}
			break;
		case NodeType.Lambda:
			if (nodeData.lambdaType === LambdaNodeType.Pattern) {
				return {
					...nodeData,
					pattern: name.cloneName(nodeData.pattern),
				};
			}
			break;
	}
	return {
		...nodeData,
	};
};

export const nodeDataToInfoString = (data: NodeData): string => {
	switch (data.type) {
		case NodeType.Literal:
			return JSON.stringify(data.value);
		case NodeType.Beta:
			if (data.betaType === BetaNodeType.Name) {
				return `${data.name.name}@${data.name.module} (${data.argc})`;
			}
			break;
		case NodeType.Lambda:
			if (data.lambdaType === LambdaNodeType.Pattern) {
				return `${data.pattern.name}@${data.pattern.module} (${data.argc})`;
			}
			break;
		case NodeType.Comment:
			return data.content;
		case NodeType.Def:
			return `def`;
	}
	return "";
};

export const extractName = (str: string): Name => {
	// Extract first word
	const trimmed = str.trim();
	const firstSpace = trimmed.indexOf(" ");
	let name: string = trimmed;
	if (firstSpace !== -1) {
		name = trimmed.slice(0, firstSpace);
	}
	// Split by @
	const firstAt = name.indexOf("@");
	if (firstAt === -1) {
		return {
			module: "",
			name,
		};
	} else {
		return {
			module: name.slice(firstAt + 1),
			name: name.slice(0, firstAt),
		};
	}
};

export const convertNodeDataType = (
	type: NodeType,
	node: NodeData,
): NodeData => {
	if (node.type === type) return node;
	const str = nodeDataToInfoString(node);
	switch (type) {
		case NodeType.Literal:
			return {
				type: NodeType.Literal,
				value: str,
			};
		case NodeType.Beta: {
			const name = extractName(str);
			if (name.name === "") {
				return {
					type: NodeType.Beta,
					betaType: BetaNodeType.App,
					argc: 0,
				};
			} else {
				return {
					type: NodeType.Beta,
					betaType: BetaNodeType.Name,
					name,
					argc: 0,
				};
			}
		}
		case NodeType.Lambda: {
			const name = extractName(str);
			if (name.name === "") {
				return {
					type: NodeType.Lambda,
					lambdaType: LambdaNodeType.Any,
				};
			}
			return {
				type: NodeType.Lambda,
				lambdaType: LambdaNodeType.Pattern,
				pattern: name,
				argc: 0,
			};
		}
		case NodeType.Comment:
			return {
				type: NodeType.Comment,
				content: str,
			};
		case NodeType.Def:
			return {
				type: NodeType.Def,
			};
	}
};

export const nodeHandleSet = (node: NodeData): Set<string> => {
	switch (node.type) {
		case NodeType.Literal:
			return new Set([HANDLE_VAL]);
		case NodeType.Beta: {
			const set = new Set([HANDLE_VAL]);
			for (let i = 0; i < node.argc + 1; i++) {
				set.add(`${HANDLE_BETA_ARG_PREFIX}${i}`);
			}
			if (node.betaType === BetaNodeType.App) {
				set.add(HANDLE_BETA_FUN);
			}
			return set;
		}
		case NodeType.Lambda: {
			const set = new Set([
				HANDLE_VAL,
				HANDLE_LAMBDA_RET,
				HANDLE_LAMBDA_PARAM,
			]);
			if (node.lambdaType === LambdaNodeType.Pattern) {
				set.add(HANDLE_LAMBDA_ARG);
				for (let i = 0; i < node.argc + 1; i++) {
					set.add(`${HANDLE_LAMBDA_ELEM_PREFIX}${i}`);
				}
			}
			return set;
		}
		case NodeType.Def:
			return new Set([HANDLE_DEF_ARG]);
	}
	return new Set();
};
