import { Dispatch, SetStateAction } from "react";
import {
  Connection,
  Edge,
  Node,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowInstance,
  ReactFlowState,
  addEdge,
} from "reactflow";

import * as node from "../../common/node";
import { DAG } from "../../common/dag";
import { genID } from "../../common/key";

export type SetNodes = Dispatch<SetStateAction<Node[]>>;
export type SetEdges = Dispatch<SetStateAction<Edge[]>>;
export type { OnNodesChange, OnEdgesChange };

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

  constructor(name: string, path: string, historySize?: number) {
    this.name = name;
    this.path = path;

    this.history = [];
    this.historyPointer = 0;

    this.historySize = historySize ?? 128;
  }

  defNode() {
    return {
      id: "##def",
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

  updateGraphSilently(
    inst: ReactFlowInstance,
    nodesCallback?: (nodes: Node[]) => Node[],
    edgesCallback?: (edges: Edge[]) => Edge[],
  ): [Node[], Edge[]] {
    let nodes = inst.getNodes();
    let edges = inst.getEdges();
    if (nodesCallback) {
      nodes = nodesCallback(nodes);
      inst.setNodes(nodes);
    }
    if (edgesCallback) {
      edges = edgesCallback(edges);
      inst.setEdges(edges);
    }
    return [nodes, edges];
  }

  updateGraph(
    inst: ReactFlowInstance,
    nodesCallback?: (nodes: Node[]) => Node[],
    edgesCallback?: (edges: Edge[]) => Edge[],
  ) {
    const [nodes, edges] = this.updateGraphSilently(
      inst,
      nodesCallback,
      edgesCallback,
    );
    this.saveToHistory(new Graph(nodes, edges));
  }

  setNodes(inst: ReactFlowInstance, callback: (nodes: Node[]) => Node[]) {
    return this.updateGraph(inst, callback);
  }

  setEdges(inst: ReactFlowInstance, callback: (edges: Edge[]) => Edge[]) {
    return this.updateGraph(inst, undefined, callback);
  }

  // Setter helpers

  addNodeCallback(node: Node) {
    return (nodes: Node[]) => [...nodes, node];
  }

  updateNodeDataCallback(id: string, data: any) {
    return (nodes: Node[]) =>
      nodes.map(n => {
        if (n.id === id) {
          return {
            ...n,
            type: data.type,
            data: data,
          };
        }
        return n;
      });
  }

  // History Managers

  saveToHistory(graph: Graph) {
    if (this.historyPointer + 1 < this.history.length) {
      this.history = this.history.slice(0, this.historyPointer + 1);
      console.log("A");
    } else if (this.history.length >= this.historySize) {
      this.history.shift();
      console.log("B");
    }
    this.history.push(graph);
    this.historyPointer = this.history.length - 1;
  }

  getGraph(inst: ReactFlowInstance): Graph {
    return Graph.fromInstance(inst);
  }

  setGraph(inst: ReactFlowInstance, graph: Graph, keepHistory?: boolean) {
    inst.setNodes(graph.nodes);
    inst.setEdges(graph.edges);
    if (!keepHistory) {
      this.history = [graph];
      this.historyPointer = 0;
    }
  }

  resetHistory() {
    this.history = [this.history[this.historyPointer]];
    this.historyPointer = 0;
  }

  undoable() {
    return this.historyPointer > 0;
  }

  redoable() {
    return this.historyPointer < this.history.length - 1;
  }

  undo(inst: ReactFlowInstance) {
    if (!this.undoable()) {
      throw new Error("Cannot undo");
    }
    this.historyPointer -= 1;
    this.setGraph(inst, this.history[this.historyPointer], true);
  }

  redo(inst: ReactFlowInstance) {
    if (!this.redoable()) {
      throw new Error("Cannot redo");
    }
    this.historyPointer += 1;
    this.setGraph(inst, this.history[this.historyPointer], true);
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

  getCenterZitter(state: ReactFlowState) {
    const [x, y] = this.getCenter(state);
    // Random
    const dx = Math.random() * 16 - 8;
    const dy = Math.random() * 16 - 8;
    return [x + dx, y + dy];
  }
}

/* Functionality Helpers */

export class FlowContextI {
  context: FlowContext;
  inst: ReactFlowInstance;
  storeApi: any;

  constructor(context: FlowContext, inst: ReactFlowInstance, storeApi?: any) {
    this.context = context;
    this.inst = inst;
    this.storeApi = storeApi;
  }

  // Add
  addEmptyNodeAt(x: number, y: number) {
    this.context.setNodes(this.inst, ns => {
      return [
        ...ns,
        {
          id: genID(),
          type: node.NodeType.Beta,
          data: node.emptyBetaNode(),
          position: {
            x: x,
            y: y,
          },
        },
      ];
    });
  }

  addEmptyNode() {
    let center;
    if (this.storeApi) {
      center = this.context.getCenterZitter(this.storeApi.getState());
    } else {
      center = [0, 0];
    }
    this.addEmptyNodeAt(center[0], center[1]);
  }

  // Add edge
  handleConnect(param: Connection | Edge) {
    const edge = { ...param } as Edge;
    for (const n of this.inst.getNodes()) {
      if (n.id === param.source) {
        edge.type = n.type;
        break;
      }
    }
    this.context.setEdges(this.inst, es => addEdge(edge, es));
  }

  // Delete
  deleteNode(id: string) {
    this.context.setNodes(this.inst, ns => ns.filter(n => n.id !== id));
    this.context.setEdges(this.inst, es =>
      es.filter(e => e.source !== id && e.target !== id),
    );
  }

  deleteEdge(id: string) {
    this.context.setEdges(this.inst, es => es.filter(e => e.id !== id));
  }

  deleteSelected() {
    this.context.updateGraph(
      this.inst,
      ns => ns.filter(n => !n.selected),
      es => es.filter(e => !e.selected),
    );
  }

  // Select
  deselectAll() {
    this.context.updateGraph(
      this.inst,
      ns => ns.map(n => (n.selected ? { ...n, selected: false } : n)),
      es => es.map(e => (e.selected ? { ...e, selected: false } : e)),
    );
  }

  // History
  undo(): boolean {
    if (!this.context.undoable()) return false;
    this.context.undo(this.inst);
    return true;
  }

  redo(): boolean {
    if (!this.context.redoable()) return false;
    this.context.redo(this.inst);
    return true;
  }
}
