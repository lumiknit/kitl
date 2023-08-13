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
export const HANDLE_BETA_RET = "ret";
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

export const HANDLE_LAMBDA_FALLBACK = "fb";
export const HANDLE_LAMBDA_ARG = "arg";
export const HANDLE_LAMBDA_ELEM_PREFIX = "elem-";
export const handleLambdaElem = (i: number) =>
  `${HANDLE_LAMBDA_ELEM_PREFIX}${i}`;
export const HANDLE_LAMBDA_RET = "ret";
export const HANDLE_LAMBDA_VAL = "val";

export const emptyLambdaNode = (): LambdaNodeData => ({
  type: NodeType.Lambda,
  lambdaType: LambdaNodeType.Any,
});

// Comment

export type CommentNodeData = {
  type: NodeType.Comment;
  content: string;
};

export const emptyCommentNode = (): CommentNodeData => ({
  type: NodeType.Comment,
  content: "*Comment* here in markdown",
});

// Def

export type DefNodeData = {
  type: NodeType.Def;
};

export const emptyDefNode = (): DefNodeData => ({
  type: NodeType.Def,
});

export const HANDLE_DEF_ARG = "arg";

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

export const cloneNodeData = (node: NodeData): NodeData => {
  // Clone the node and remove all unused properties
  switch (node.type) {
    case NodeType.Literal:
      return {
        type: NodeType.Literal,
        value: node.value,
      };
    case NodeType.Beta:
      switch (node.betaType) {
        case BetaNodeType.App:
          return {
            type: NodeType.Beta,
            betaType: BetaNodeType.App,
            argc: node.argc,
          };
        case BetaNodeType.Name:
          return {
            type: NodeType.Beta,
            betaType: BetaNodeType.Name,
            argc: node.argc,
            name: name.cloneName(node.name),
          };
      }
      break;
    case NodeType.Lambda:
      switch (node.lambdaType) {
        case LambdaNodeType.Any:
          return {
            type: NodeType.Lambda,
            lambdaType: LambdaNodeType.Any,
          };
        case LambdaNodeType.Pattern:
          return {
            type: NodeType.Lambda,
            lambdaType: LambdaNodeType.Pattern,
            pattern: name.cloneName(node.pattern),
            argc: node.argc,
          };
      }
      break;
    case NodeType.Comment:
      return {
        type: NodeType.Comment,
        content: node.content,
      };
    case NodeType.Def:
      return {
        type: NodeType.Def,
      };
  }
};

export const nodeDataToInfoString = (data: NodeData): string => {
  switch (data.type) {
    case NodeType.Literal:
      return JSON.stringify(data.value);
    case NodeType.Beta:
      if (data.betaType === BetaNodeType.App) {
        return `. (${data.argc})`;
      } else {
        return `${data.name.name}@${data.name.module} (${data.argc})`;
      }
    case NodeType.Lambda:
      if (data.lambdaType === LambdaNodeType.Pattern) {
        return `${data.pattern.name}@${data.pattern.module} (${data.argc})`;
      } else {
        return `lambda`;
      }
    case NodeType.Comment:
      return data.content;
    case NodeType.Def:
      return `def`;
  }
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
