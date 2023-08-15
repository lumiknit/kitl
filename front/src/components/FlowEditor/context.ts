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

import { NodeType } from "../../common/node";
import { DAG } from "../../common/dag";

export type SetNodes = Dispatch<SetStateAction<Node[]>>;
export type SetEdges = Dispatch<SetStateAction<Edge[]>>;
export type { OnNodesChange, OnEdgesChange };

/* --- WIP */

export class Graph {
  nodes: Node[];
  edges: Edge[];

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  static fromInstance(instance: ReactFlowInstance) {
    return new Graph(instance.getNodes(), instance.getEdges());
  }
}

export class _FlowContext {
  name: string;
  path: string;

  history: Graph[];
  historyPointer: number;

  // Configurations
  historySize: number;

  constructor(
    inst: ReactFlowInstance,
    name: string,
    path: string,
    historySize: number,
    graph?: Graph,
  ) {
    this.name = name;
    this.path = path;
    
    this.history = [];
    this.historyPointer = 0;

    this.historySize = historySize;

    if(graph !== undefined) {
      this.setGraph(inst, graph);
    } else {
      this.setGraph(inst, new Graph(
        [this.defNode()],
        []
      ));
    }
  }

  defNode() {
    return {
      id: "##start",
      type: "def",
      data: {
        module: this.path,
        name: this.name,
      },
      position: {
        x: 0,
        y: 0,
      },
      selectable: false,
      deletable: false,
    };
  }

  setNodes(inst: ReactFlowInstance, callback: (nodes: Node[]) => Node[]) {
    inst.setNodes(callback);
    this.saveToHistory(inst);
  }

  setEdges(inst: ReactFlowInstance, callback: (nodes: Edge[]) => Edge[]) {
    inst.setEdges(callback);
    this.saveToHistory(inst);
  }

  saveToHistory(inst: ReactFlowInstance) {
    if (this.historyPointer < this.history.length) {
      this.history = this.history.slice(0, this.historyPointer);
    } else if (this.history.length > this.historySize) {
      this.history.shift();
    }
    this.history.push(this.getGraph(inst));
  }

  getGraph(inst: ReactFlowInstance): Graph {
    return Graph.fromInstance(inst);
  }

  setGraph(inst: ReactFlowInstance, graph: Graph) {
    inst.setNodes(graph.nodes);
    inst.setEdges(graph.edges);
  }

  undoable() {
    return this.historyPointer > 0;
  }

  redoable() {
    return this.historyPointer < this.history.length;
  }

  undo(inst: ReactFlowInstance) {
    if (!this.undoable()) {
      throw new Error("Cannot undo");
    }
    this.historyPointer -= 1;
    this.setGraph(inst, this.history[this.historyPointer]);
  }

  redo(inst: ReactFlowInstance) {
    if (!this.redoable()) {
      throw new Error("Cannot redo");
    }
    this.historyPointer += 1;
    this.setGraph(inst, this.history[this.historyPointer]);
  }

  checkGraphError() {}

  convertToDAG(): DAG {
    throw new Error("TODO");
  }

  layout() {}
}

/* --- */

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
    id: "##def",
    type: "def",
    data: {
      module: "main/test",
      name: name,
    },
    position: {
      x: 0,
      y: 0,
    },
    selectable: false,
    deletable: false,
  },
  {
    id: "7",
    type: "literal",
    data: {
      type: NodeType.Literal,
      value: [
        42,
        [1, 2, 3],
        19,
        {
          hello: "world! boom sh ddddddddddddddd",
          test: [],
          singleton: { a: "20" },
          pair: { a: "20", b: 30 },
          Hello: {},
          Abc: [[]],
          Boom: "Good",
        },
        "abc",
      ],
    },
    position: {
      x: 0,
      y: 230,
    },
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

  // Find multiple incomings
  for (const k of inMap.keys()) {
    const arr = inMap.get(k);
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
