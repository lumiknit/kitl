import { ReactInstance, useCallback, useState } from "react";

import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Node,
  Edge,
  ReactFlowInstance,
} from "reactflow";

import "reactflow/dist/style.css";
import "./FlowEditor.css";

import * as fh from "./helper";

import DefNode from "./CustomNodes/DefNode";
import OpNode from "./CustomNodes/OpNode";
import ConstNode from "./CustomNodes/ConstNode";
import SelectNode from "./CustomNodes/SelectNode";
import MemNode from "./CustomNodes/MemNode";

import FlowEditorHeader from "./FlowEditorHeader";

const getID = () => {
  return Math.random().toString(36).substring(7);
};

const nodeTypes = {
  def: DefNode,
  op: OpNode,
  const: ConstNode,
  select: SelectNode,
  mem: MemNode,
};

const initNodes: Node[] = [
  {
    id: "##def",
    type: "def",
    data: "my_func",
    position: {
      x: 0,
      y: 0,
    },
  },
];

type FlowEditorState = {
  mode: fh.EditingMode;
};

const FlowEditor = () => {
  const instance: ReactFlowInstance[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params: Connection | Edge) => {
    const targetNode = params.target;
    const targetHandle = params.targetHandle;
    setEdges((es) => {
      // Remove any existing edges from the target handle
      const newEdges = es.filter(e => {
        return !(e.target === targetNode && e.targetHandle === targetHandle);
      });
      // Add the new edge
      return [...newEdges, params];
    });
  }, []);

  const [state, setState] = useState<FlowEditorState>({
    mode: fh.EditingMode.AddNode,
  });

  const updateMode = (mode: fh.EditingMode) => {
    const newState = { ...state };
    newState.mode = mode;
    setState(newState);
  };

  const addNode = (type: string, data: any) => {
    // Find viewport center
    let x = 0;
    let y = 0;
    if (instance[0] !== undefined) {
      const viewport = instance[0].getViewport();
      console.log(viewport);
      x = viewport.x;
      y = viewport.y;
    }
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
        onInit={rfi => {
          instance[0] = rfi;
          console.log(rfi);
        }}
        onNodeDoubleClick={(event, node) => {
          // TODO: Edit node
          if (node.type === "op") {
            // Edit function name
          } else if (node.type === "const") {
            // Edit JSON
          }
          alert(node);
        }}
        onEdgeDoubleClick={(event, edge) => {
          // Remove the edge
          setEdges(es => es.filter(e => e.id !== edge.id));
        }}
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
