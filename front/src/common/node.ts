import * as j from "./json";

export type Name = {
  module: string;
  name: string;
};

export enum NodeType {
  Def = "def",
  Beta = "beta",
  Lambda = "lambda",
  Comment = "comment",
}

export type NodeID = string;
export type HandleID = string;

export type EdgeSource = {
  nodeID: NodeID;
  handleID: HandleID;
};

export enum BetaNodeType {
  Literal,
  App,
  Name,
}

export type BetaNodeLiteral = {
  type: NodeType.Beta;
  betaType: BetaNodeType.Literal;
  value: j.Json;
};

export type BetaNodeApp = {
  type: NodeType.Beta;
  betaType: BetaNodeType.App;
  argc: number;
};

export type BetaNodeName = {
  type: NodeType.Beta;
  betaType: BetaNodeType.Name;
  name: Name;
  argc: number;
};

export type BetaNodeData =
  | BetaNodeLiteral
  | BetaNodeApp
  | BetaNodeName;

export const HANDLE_BETA_ARG_PREFIX = "arg-";
export const handleBetaArg = (i: number) => `${HANDLE_BETA_ARG_PREFIX}${i}`;
export const HANDLE_BETA_RET = "ret";
export const HANDLE_BETA_FUN = "fun";

export const emptyBetaNode = () => ({
  type: NodeType.Beta,
  betaType: BetaNodeType.Literal,
  value: null,
});

export type LambdaPatternNodeData = {
  type: NodeType.Lambda;
  pattern: Name;
  argc: number;
};

export type LambdaAnyNodeData = {
  type: NodeType.Lambda;
};

export type LambdaNodeData =
  | LambdaPatternNodeData
  | LambdaAnyNodeData;

export const HANDLE_LAMBDA_FALLBACK = "fb";
export const HANDLE_LAMBDA_ARG = "arg";
export const HANDLE_LAMBDA_ELEM_PREFIX = "elem-";
export const handleLambdaElem = (i: number) => `${HANDLE_LAMBDA_ELEM_PREFIX}${i}`;
export const HANDLE_LAMBDA_RET = "ret";
export const HANDLE_LAMBDA_VAL = "val";

export const emptyLambdaNode = () => ({
  type: NodeType.Lambda,
});

export type CommentNodeData = {
  type: NodeType.Comment;
  content: string;
};

export const emptyCommentNode = () => ({
  type: NodeType.Comment,
  content: "*Comment* here in markdown",
});

export type DefNodeData = {
  type: NodeType.Def;
};

export const emptyDefNode = () => ({
  type: NodeType.Def,
});

export const HANDLE_DEF_ARG = "arg";

export type NodeData =
  | BetaNodeData
  | LambdaNodeData
  | CommentNodeData
  | DefNodeData;

export type Node = {
  id: string;
  data: NodeData;
  edges: {[key: HandleID]: EdgeSource};
};