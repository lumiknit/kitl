import { NodeData } from "../../common/node";
import * as fc from "../FlowEditor/context";
import { Node } from "reactflow";

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

export class KitlContext {
  path: string;
  name: string;

  flowContext: fc.FlowContext;

  constructor(path: string, name: string) {
    this.path = path;
    this.name = name;
    this.flowContext = fc.useEmptyFlowContext(name, path);
  }

  applySubEditing(path: string, value: any) {
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
          this.flowContext.setNodes(updateNodeData(id, value));
        }
        break;
    }
  }
}
