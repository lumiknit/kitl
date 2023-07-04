import { useCallback, useState } from "react";

import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ReactFlowInstance,
  NodeMouseHandler,
  EdgeMouseHandler,
  useStoreApi,
} from "reactflow";

import "reactflow/dist/style.css";
import "./FlowEditor.css";

import * as fh from "./helper";

import DefNode from "./CustomNodes/DefNode";
import OpNode from "./CustomNodes/OpNode";
import ConstNode from "./CustomNodes/ConstNode";
import SelectNode from "./CustomNodes/SelectNode";
import MemNode from "./CustomNodes/MemNode";
import CommentNode from "./CustomNodes/CommentNode";

import FlowEditorHeader from "./FlowEditorHeader";

const getID = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60 * 1000;
  const utcMS = now.getTime() + offset;
  const utcSec = Math.round(utcMS / 1000);
  const timeString = utcSec.toString(36);
  const randomString = Math.random().toString(36).substring(7);
  return `${timeString}-${randomString}`;
};

const nodeTypes = {
  def: DefNode,
  op: OpNode,
  const: ConstNode,
  select: SelectNode,
  mem: MemNode,
  comment: CommentNode,
};

const defNode = (name: string) => {
  return {
    id: "##def",
    type: "def",
    data: name,
    position: {
      x: 0,
      y: 0,
    },
    draggable: false,
    selectable: false,
    deletable: false,
  };
};

const initNodes: Node[] = [defNode("main_function")];

export type FlowEditorProps = {
  openJsonEditor: (path: string, data: any) => void;
};

type FlowEditorState = {
  mode: fh.EditingMode;
};

const FlowEditor = (props: FlowEditorProps) => {
  let instance: ReactFlowInstance | undefined = undefined;
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [state, setState] = useState<FlowEditorState>({
    mode: fh.EditingMode.AddNode,
  });

  const storeApi = useStoreApi();

  const getCenter = () => {
    const {
      height,
      width,
      transform: [tx, ty, zoom],
    } = storeApi.getState();
    const zoomMultiplier = 1 / zoom;
    const x = (width / 2 - tx) * zoomMultiplier;
    const y = (height / 2 - ty) * zoomMultiplier;
    return [x, y];
  };

  const onConnect = useCallback((params: Connection | Edge) => {
    const targetNode = params.target;
    const targetHandle = params.targetHandle;
    setEdges(es => {
      // Remove any existing edges from the target handle
      const newEdges = es.filter(e => {
        return !(e.target === targetNode && e.targetHandle === targetHandle);
      });
      // Add the new edge
      return addEdge(params, newEdges);
    });
  }, []);

  const onInit = (rfi: ReactFlowInstance) => {
    instance = rfi;
    console.log(instance);
  };

  const onNodeDoubleClick: NodeMouseHandler = (_event, node: Node) => {
    // TODO: Edit node
    switch (node.type) {
      case "op":
        break;
      case "const":
        props.openJsonEditor("const:" + node.id, node.data);
        break;
      case "comment":
        break;
    }
  };

  const onEdgeDoubleClick: EdgeMouseHandler = (_event, edge: Edge) => {
    // Remove the edge
    setEdges(es => es.filter(e => e.id !== edge.id));
  };

  const updateMode = (mode: fh.EditingMode) => {
    const newState = { ...state };
    newState.mode = mode;
    setState(newState);
  };

  const addNode = (type: string, data: any) => {
    // Find viewport center
    const [x, y] = getCenter();
    const newNode: Node = {
      id: getID(),
      type: type,
      data: data,
      position: {
        x: x,
        y: y,
      },
    };
    setNodes(ns => [...ns, newNode]);
  };

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        snapGrid={[10, 10]}
        snapToGrid
        fitView
        nodesDraggable
        onlyRenderVisibleElements
        onInit={onInit}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        proOptions={{
          hideAttribution: true,
        }}>
        <Controls />
        <Background
          color="#44f2"
          size={4}
          gap={20}
          variant={BackgroundVariant.Cross}
        />
      </ReactFlow>
      <FlowEditorHeader
        mode={state.mode}
        updateMode={updateMode}
        addNode={addNode}
      />
    </>
  );
};

export default FlowEditor;
