import * as fc from "../FlowEditor/context";
import { Node } from "reactflow";

export type KitlContext = {
  // FlowEditor context
  path: string;
  name: string;

  flowContext: fc.FlowContext;
};

export const newKitlContext = (path: string) => {
  console.warn("value parsing is not implemented");
  return {
    path,
    name: path,
    flowContext: fc.useEmptyFlowContext(path, path),
  };
};

export type KitlEditingState = {
  valueChanges: Map<string, any>;
};

export const emptyKitlEditingState = (): KitlEditingState => ({
  valueChanges: new Map<string, any>(),
});

export const addValueChange = (
  st: KitlEditingState,
  path: string,
  value: any
) => {
  const newMap = new Map(st.valueChanges);
  newMap.set(path, value);
  return {
    ...st,
    valueChanges: newMap,
  };
};

const parsePath = (path: string) => {
  const splitted = path.split(":");
  if (splitted.length === 1) {
    return ["a", splitted[0]];
  } else if (splitted.length === 2) {
    return [splitted[0], splitted[1]];
  } else {
    throw new Error("Invalid path: " + path);
  }
};

const updateNodeData = (id: string, value: any) => (nodes: Node[]) =>
  nodes.map(node => {
    if (node.id !== id) return node;
    return {
      ...node,
      data: value,
    };
  });

export const applySubEditingState = (
  ctx: KitlContext,
  st: KitlEditingState
) => {
  for (const path of st.valueChanges.keys()) {
    const [pType, id] = parsePath(path);
    const value = st.valueChanges.get(path);
    switch (pType) {
      case "nd-cmt":
        {
          // Comment Node
          ctx.flowContext.setNodes(updateNodeData(id, value));
        }
        break;
      case "nd-op":
        {
          // Operation Node
          ctx.flowContext.setNodes(updateNodeData(id, value));
        }
        break;
      case "nd-c":
        {
          // Const Node
          ctx.flowContext.setNodes(updateNodeData(id, value));
        }
        break;
    }
  }
  st.valueChanges = new Map<string, any>();
};
