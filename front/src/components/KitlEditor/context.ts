import { NodeData } from "../../common/node";
import * as fc from "../FlowEditor/context";
import { Node } from "reactflow";

export type KitlContext = {
  // FlowEditor context
  path: string;
  name: string;

  flowContext: fc.FlowContext;
};

export const newKitlContext = (path: string) => {
  /*console.warn("value parsing is not implemented"); */
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
  value: any,
) => {
  const newMap = new Map<string, any>(st.valueChanges);
  const nm = newMap.set(path, value);
  const newState = {
    valueChanges: nm,
  };
  return newState;
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

export const applySubEditing = (ctx: KitlContext, path: string, value: any) => {
  const [pType, id] = parsePath(path);
  switch (pType) {
    case "nd":
      {
        const updateNodeData =
          (id: string, value: NodeData) => (nodes: Node[]) =>
            nodes.map(node => {
              if (node.id !== id) return node;
              return {
                ...node,
                type: value.type,
                data: value,
              };
            });
        ctx.flowContext.setNodes(updateNodeData(id, value));
      }
      break;
  }
};

export const applySubEditingState = (
  ctx: KitlContext,
  st: KitlEditingState,
) => {
  for (const path of st.valueChanges.keys()) {
    const value = st.valueChanges.get(path);
    applySubEditing(ctx, path, value);
  }
  st.valueChanges = new Map<string, any>();
};
