import {
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
  ReactFlowState,
  addEdge,
} from "reactflow";

import * as clipboard from "../../common/clipboard";

import * as node from "../../common/node";
import { DAG } from "../../common/dag";
import { genID } from "../../common/key";

// Minimal node for analyzing graph

export class MNodeSource {
  // Node ID
  id: string;
  // Index of the handle. 0 is the leftmost arg handle, 1 is the next one, and so on.
  // -1 is the left lambda ret handle.
  index: number;

  constructor(id: string, index: number) {
    this.id = id;
    this.index = index;
  }
}

export class MNode {
  // Minimal node data to apply graph algorithms
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  sources: MNodeSource[];

  constructor(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    sources: MNodeSource[],
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sources = sources;
  }

  static fromReactFlowNode(n: Node) {
    return new MNode(
      n.id,
      n.position.x,
      n.position.y,
      n.width ?? 0,
      n.height ?? 0,
      [],
    );
  }
}

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

  toJSON() {
    return JSON.stringify({
      nodes: this.nodes,
      edges: this.edges,
    });
  }

  static fromJSON(j: string): Graph | null {
    try {
      const obj = JSON.parse(j);
      if (!Array.isArray(obj.nodes) || !Array.isArray(obj.edges)) {
        return null;
      }
      return new Graph(obj.nodes, obj.edges);
    } catch (e) {
      return null;
    }
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

    this.historySize = historySize ?? 512;
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
    } else if (this.history.length >= this.historySize) {
      this.history.shift();
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
    const emptyNode = {
      id: genID(),
      type: node.NodeType.Beta,
      data: node.emptyBetaNode(),
      position: {
        x: x,
        y: y,
      },
    };
    this.context.setNodes(this.inst, ns => {
      return [...ns, emptyNode];
    });
    return emptyNode;
  }

  addEmptyNode() {
    let center;
    if (this.storeApi) {
      center = this.context.getCenterZitter(this.storeApi.getState());
    } else {
      center = [0, 0];
    }
    return this.addEmptyNodeAt(center[0], center[1]);
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
    this.context.updateGraph(
      this.inst,
      ns =>
        ns.map(n => {
          if (n.id === edge.target && n.type === node.NodeType.Beta) {
            const data = n.data as node.BetaNodeData;
            const handle = edge.targetHandle;
            if (handle === `${node.HANDLE_BETA_ARG_PREFIX}${data.argc}`) {
              return {
                ...n,
                data: {
                  ...data,
                  argc: data.argc + 1,
                },
              };
            }
          }
          return n;
        }),
      es =>
        addEdge(
          edge,
          es.filter(
            e =>
              e.target !== edge.target || e.targetHandle !== edge.targetHandle,
          ),
        ),
    );
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

  // Copy selected
  copySelected(): boolean {
    const allNodes: Node[] = this.inst.getNodes();
    const allEdges: Edge[] = this.inst.getEdges();
    // Gather selected nodes and edges
    const nodes: Node[] = allNodes
      .filter(n => n.selected && n.type !== node.NodeType.Def)
      .map(n => ({ ...n, selected: false }));
    const edges: Edge[] = allEdges
      .filter(e => e.selected)
      .map(e => ({ ...e, selected: false }));
    if (nodes.length + edges.length === 0) return false;
    const nodesIDSet = new Set(nodes.map(n => n.id));
    // Find all edges incident to only selected nodes
    for (const e of allEdges) {
      if (e.selected) continue;
      if (nodesIDSet.has(e.source) && nodesIDSet.has(e.target)) {
        edges.push(e);
      }
    }
    // Find all nodes which is the end of edge
    const edgeEndSet = new Set(
      edges.reduce(
        (acc: string[], e: Edge) => [...acc, e.source, e.target],
        [],
      ),
    );
    for (const n of allNodes) {
      if (n.selected) continue;
      if (n.type === node.NodeType.Def) continue;
      if (edgeEndSet.has(n.id)) {
        nodes.push(n);
      }
    }
    // Create a graph and copy
    const graph = new Graph(nodes, edges);
    clipboard.saveString(graph.toJSON());
    return true;
  }

  cutSelected(): boolean {
    if (this.copySelected()) {
      this.deleteSelected();
      return true;
    }
    return false;
  }

  async paste(): Promise<boolean> {
    const graph = Graph.fromJSON(await clipboard.loadString());
    if (!graph) return false;
    const allowedTypes: Set<string> = new Set([
      node.NodeType.Beta,
      node.NodeType.Lambda,
      node.NodeType.Comment,
      node.NodeType.Literal,
    ]);
    const nodeIDMap = new Map<string, string>();
    let x = 0;
    let y = 0;
    const nodes = graph.nodes.reduce((acc: Node[], n: Node) => {
      if (n.type === undefined || !allowedTypes.has(n.type)) return acc;
      const newID = genID();
      nodeIDMap.set(n.id, newID);
      acc.push({ ...n, id: newID, selected: true });
      x += n.position.x;
      y += n.position.y;
      return acc;
    }, []);
    if (nodes.length === 0) return false;
    // Calculate center of mass
    x /= nodes.length;
    y /= nodes.length;
    const center = this.context.getCenter(this.storeApi.getState());
    // Calculate offset
    const dx = center[0] - x;
    const dy = center[1] - y;
    // Move nodes
    for (const n of nodes) {
      n.position.x += dx;
      n.position.y += dy;
    }

    const edges = graph.edges.reduce((acc: Edge[], e: Edge) => {
      if (!nodeIDMap.has(e.source) || !nodeIDMap.has(e.target)) return acc;
      acc.push({
        ...e,
        id: genID(),
        source: nodeIDMap.get(e.source)!,
        target: nodeIDMap.get(e.target)!,
        selected: true,
      });
      return acc;
    }, []);
    this.context.updateGraph(
      this.inst,
      ns => [...ns, ...nodes],
      es => [...es, ...edges],
    );
    return true;
  }

  // -- Heavy graph algorithms

  // Graph algorithm helper
  getMNodes(): Map<string, MNode> {
    const nodes = this.inst.getNodes();
    const edges = this.inst.getEdges();
    const nodeMap = new Map<string, MNode>();
    for (const n of nodes) {
      nodeMap.set(n.id, MNode.fromReactFlowNode(n));
    }
    for (const e of edges) {
      const target = nodeMap.get(e.target);
      if (!target) continue;
      let index = 0;
      const handle = e.targetHandle ?? "";
      if (handle === node.HANDLE_LAMBDA_BODY_RET) {
        index = -1;
      } else if (handle.startsWith(node.HANDLE_BETA_ARG_PREFIX)) {
        index = parseInt(handle.slice(node.HANDLE_BETA_ARG_PREFIX.length));
      }
      target.sources.push(new MNodeSource(e.source, index));
    }
    return nodeMap;
  }

  selectUnreachables() {
    const mnodes = this.getMNodes();
    // Find def node, which is the root of the graph
    let defNode: MNode | null = null;
    for (const n of mnodes.values()) {
      if (n.id === "##def") {
        defNode = n;
        break;
      }
    }
    if (!defNode) return;
    // Find all reachable nodes
    const reachable = new Set<string>();
    const queue = [defNode];
    while (queue.length > 0) {
      const n = queue.pop()!;
      if (reachable.has(n.id)) continue;
      reachable.add(n.id);
      for (const s of n.sources) {
        const source = mnodes.get(s.id);
        if (!source) continue;
        queue.push(source);
      }
    }
    // Select all unreachable nodes
    this.context.setNodes(this.inst, ns =>
      ns.map(n => {
        if (reachable.has(n.id)) return n;
        return {
          ...n,
          selected: true,
        };
      }),
    );
  }

  // Layout
  layoutDefault() {
    throw new Error("Unimplemented");
  }

  layoutLinear() {
    const mnodes = this.getMNodes();
    let x = 0;
    let y = 0;
    for (const n of mnodes.values()) {
      n.x = x;
      n.y = y;
      x += 16;
      y += n.height + 16;
    }
    this.context.setNodes(this.inst, ns =>
      ns.map(n => {
        const mnode = mnodes.get(n.id);
        if (!mnode) return n;
        return {
          ...n,
          position: {
            x: mnode.x,
            y: mnode.y,
          },
        };
      }),
    );
    throw new Error("Unimplemented");
  }

  validateGraph() {
    throw new Error("Unimplemented");
  }

  executeGraphTools(name: string) {
    switch (name) {
      case "selectUnreachables":
        return this.selectUnreachables();
      case "layoutDefault":
        return this.layoutDefault();
      case "layoutLinear":
        return this.layoutLinear();
      case "validateGraph":
        return this.validateGraph();
      case "":
        return;
      default:
        throw new Error(`Unknown graph tool: ${name}`);
    }
  }
}
