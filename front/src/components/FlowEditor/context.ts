import { Dispatch, SetStateAction } from "react";
import {
  Edge,
  Node,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowInstance,
  ReactFlowState,
} from "reactflow";

import * as node from "../../common/node";
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

export class FlowContext {
  name: string;
  path: string;

  history: Graph[];
  historyPointer: number;

  // Configurations
  historySize: number;

  // Initialization

  constructor(
    name: string,
    path: string,
    historySize: number,
  ) {
    this.name = name;
    this.path = path;
    
    this.history = [];
    this.historyPointer = 0;

    this.historySize = historySize;
  }

  defNode() {
    return {
      id: "##start",
      type: node.NodeType.Def,
      data: {
        type: node.NodeType.Def,
        name: this.name,
        module: this.path,
      },
      position: {
        x: 0,
        y: 0,
      },
      selectable: false,
      deletable: false,
    };
  }

  emptyGraph() {
    console.log(this.defNode());
    return new Graph([this.defNode()], []);
  }

  // Setters

  setNodes(inst: ReactFlowInstance, callback: (nodes: Node[]) => Node[]) {
    inst.setNodes(callback);
    this.saveToHistory(inst);
  }

  setEdges(inst: ReactFlowInstance, callback: (nodes: Edge[]) => Edge[]) {
    inst.setEdges(callback);
    this.saveToHistory(inst);
  }

  // Setter helpers

  addNodeCallback(node: Node) {
    return (nodes: Node[]) => [...nodes, node];
  }

  updateNodeDataCallback(id: string, data: any) {
    return (nodes: Node[]) => nodes.map(n => {
      if(n.id === id) {
        return {
          ...n,
          type: data.type,
          data: data
        };
      }
      return n;
    });
  }

  // History Managers

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

  // Graph validator

  checkGraphError() {}

  // DAG Converter

  convertToDAG(): DAG {
    throw new Error("TODO");
  }

  // Layout

  layout() {}

  // Helpers

  getCenter(state: ReactFlowState) {
    const {
      height,
      width,
      transform: [tx, ty, zoom],
    } = state;
    const zoomMultiplier = 1 / zoom;
    const x = (width / 2 - tx) * zoomMultiplier;
    const y = (height / 2 - ty) * zoomMultiplier;
    return [x, y];
  }
}