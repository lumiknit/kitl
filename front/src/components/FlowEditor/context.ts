import { Dispatch, SetStateAction } from "react";
import {
  Edge,
  Node,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";

export type SetNodes = Dispatch<SetStateAction<Node[]>>;
export type SetEdges = Dispatch<SetStateAction<Edge[]>>;
export type { OnNodesChange, OnEdgesChange };

export type FlowContext = {
  name: string;
  path: string;

  initNodes: Node[];
  setNodes: SetNodes;
  onNodesChange: OnNodesChange;

  initEdges: Edge[];
  setEdges: SetEdges;
  onEdgesChange: OnEdgesChange;

  instance: ReactFlowInstance;

  // Graph errors
  hasCycle: boolean;
  hasMultipleSource: boolean;
};

const initialNodes = (name: string) => [
  {
    id: "##start",
    type: "start",
    data: name,
    position: {
      x: 0,
      y: 0,
    },
    draggable: false,
    selectable: false,
    deletable: false,
  },
  {
    id: "##end",
    type: "end",
    data: name,
    position: {
      x: 0,
      y: 128,
    },
    selectable: false,
    deletable: false,
  },
];

export const useEmptyFlowContext = (
  name: string,
  path: string,
): FlowContext => {
  const initNodes: Node[] = initialNodes(name);
  const initEdges: Edge[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  return {
    name,
    path,
    initNodes: nodes,
    setNodes,
    onNodesChange,
    initEdges: edges,
    setEdges,
    onEdgesChange,
    instance: useReactFlow(),
    hasCycle: false,
    hasMultipleSource: false,
  };
};

export const markErrorEdges = (context: FlowContext, errors: Set<string>) => {
  context.instance.setEdges(edges =>
    edges.map(e => {
      if (errors.has(e.id)) {
        return { ...e, className: "flow-edge-error" };
      } else {
        return e;
      }
    }),
  );
};

export const unmarkErrorEdges = (context: FlowContext) => {
  context.instance.setEdges(edges =>
    edges.map(e => {
      return { ...e, className: "flow-edge-error" };
    }),
  );
  context.hasMultipleSource = false;
  context.hasCycle = false;
};

export const updateGraphError = (context: FlowContext) => {
  // Reset edge status
  unmarkErrorEdges(context);

  // Create errors
  const errors = new Set<string>();

  // Get incoming edges
  const nodeMap = new Map<string, Edge[]>(); // node to incoming edge
  const inMap = new Map<string, Edge[]>(); // handle to incoming edge
  for (const e of context.instance.getEdges()) {
    // Set nodeMap
    let arr = nodeMap.get(e.target);
    if (arr === undefined) {
      arr = [];
      nodeMap.set(e.target, arr);
    }
    // Set inMap
    const tgt = `${e.target}::${e.targetHandle}`;
    arr = inMap.get(tgt);
    if (arr === undefined) {
      arr = [];
      inMap.set(tgt, arr);
    }
    arr.push(e);
  }
  console.log(inMap);

  // Find multiple incomings
  for (const k of inMap.keys()) {
    const arr = inMap.get(k);
    console.log(k, arr);
    if (arr === undefined) continue;

    if (arr.length > 1) {
      // Multiple incoming edges
      context.hasMultipleSource = true;
      for (const e of arr) {
        errors.add(e.id);
      }
    }
  }

  // Find cycles, from ##def node using dfs without recursion
  const visited = new Map<string, Edge>();
  const stack = new Array<string>();
  const idx = new Array<number>();
  stack.push("##def");
  idx.push(0);
  while (stack.length > 0) {
    const id = stack[stack.length - 1];
    const i = idx[idx.length - 1];
    const arr = nodeMap.get(id);
    if (arr === undefined || i >= arr.length) {
      stack.pop();
      idx.pop();
      visited.delete(id);
      continue;
    } else {
      const e = arr[i];
      const v = visited.get(e.id);
      if (v === undefined) {
        // Not visited
        visited.set(e.id, e);
        stack.push(e.source);
        idx[idx.length - 1]++;
        idx.push(0);
      } else {
        // Cycle detected
        context.hasCycle = true;
        // Track cycle
        let cur = e.source;
        while (cur !== id) {
          const e = visited.get(cur);
          if (e === undefined) break;
          errors.add(e.id);
          cur = e.source;
        }
      }
    }
  }

  // Mark errors
  markErrorEdges(context, errors);
};
