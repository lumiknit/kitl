import { useCallback, useState } from "react";

import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  addEdge,
  Node,
  Edge,
  NodeMouseHandler,
  EdgeMouseHandler,
  useStoreApi,
  NodeChange,
  EdgeChange,
  SelectionMode,
  ConnectionMode,
  ConnectionLineType,
  OnSelectionChangeFunc,
  MarkerType,
} from "reactflow";

import "reactflow/dist/style.css";
import "./FlowEditor.css";
import "./FlowEditorNode.scss";

import * as fh from "./helper";
import * as fc from "./context";

import StartNode from "./CustomNodes/StartNode";
import EndNode from "./CustomNodes/EndNode";
import OpNode, { Op } from "./CustomNodes/OpNode";
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
  start: StartNode,
  end: EndNode,
  op: OpNode,
  const: ConstNode,
  select: SelectNode,
  mem: MemNode,
  comment: CommentNode,
};

export type FlowEditorProps = {
  context: fc.FlowContext;
  openJsonEditor: (path: string, data: any) => void;
  openCodeArea: (path: string, data: string) => void;
  openOpNode: (path: string, data: Op) => void;
};

type FlowEditorState = {
  mode: fh.EditingMode;
};

const FlowEditor = (props: FlowEditorProps) => {
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
    props.context.setEdges(es => {
      // Remove any existing edges from the target handle
      const newEdges = es.filter(e => {
        return !(e.target === targetNode && e.targetHandle === targetHandle);
      });
      // Add the new edge
      return addEdge(params, newEdges);
    });
  }, []);

  const onNodesChangeWrapper = (changes: NodeChange[]) => {
    for (const change of changes) {
      if (change.type === "position") {
        if (change.id === "##end") {
          if (change.position !== undefined) {
            change.position.x = 0;
          }
          if (change.positionAbsolute !== undefined) {
            change.positionAbsolute.x = 0;
          }
        }
      }
    }

    return props.context.onNodesChange(changes);
  };

  let updatingGraphError = false;
  const onEdgesChangeWrapper = (edges: EdgeChange[]) => {
    props.context.onEdgesChange(edges);
    if (updatingGraphError) return;
    updatingGraphError = true;
    fc.updateGraphError(props.context);
    console.log(props.context.hasCycle);
    console.log(props.context.hasMultipleSource);
    updatingGraphError = false;
  };

  const onNodeDoubleClick: NodeMouseHandler = (_event, node: Node) => {
    // TODO: Edit node
    switch (node.type) {
      case "op":
        props.openOpNode("nd-op:" + node.id, node.data);
        break;
      case "const":
        props.openJsonEditor("nd-c:" + node.id, node.data);
        break;
      case "comment":
        props.openCodeArea("nd-cmt:" + node.id, node.data);
        break;
    }
  };

  const onEdgeDoubleClick: EdgeMouseHandler = (_event, edge: Edge) => {
    // Remove the edge
    props.context.setEdges(es => es.filter(e => e.id !== edge.id));
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
    props.context.setNodes(nodes => [...nodes, newNode]);
  };

  const deleteSelectedNode = () => {
    props.context.setNodes(nodes => nodes.filter(node => !node.selected));
  };

  return (
    <>
      <ReactFlow
        /* Basic props */
        nodes={props.context.initNodes}
        edges={props.context.initEdges}
        onNodesChange={onNodesChangeWrapper}
        onEdgesChange={onEdgesChangeWrapper}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        /* Flow View */
        fitView
        minZoom={0.5}
        maxZoom={5}
        snapGrid={[10, 10]}
        snapToGrid
        onlyRenderVisibleElements
        translateExtent={[[-1024, -1024], [Infinity, Infinity]]}
        nodeExtent={[[0, 0], [Infinity, Infinity]]}
        /* Edge Specific */
        edgeUpdaterRadius={16}
        edgesUpdatable={true}
        defaultEdgeOptions={{
          animated: false,
          /*style: {
            strokeWidth: 1.5,
            stroke: "#9ec2e6",
          },*/
          markerEnd: {
            type: MarkerType.ArrowClosed,
            //color: "#9ec2e6",
            //strokeWidth: 2,
          }
        }}
        /* General Event Handler */
        /* Node Event Handler */
        onNodeDoubleClick={onNodeDoubleClick}
        /* Edge Event Handler */
        onEdgeDoubleClick={onEdgeDoubleClick}
        /* Selection Event Handler */
        /* Interaction */
        nodesDraggable={true}
        nodesConnectable={true}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={true}
        autoPanOnConnect={true}
        autoPanOnNodeDrag={true}
        panOnDrag={true}
        selectionOnDrag={false}
        selectionMode={SelectionMode.Partial}
        panOnScroll={false}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        selectNodesOnDrag={true}
        elevateNodesOnSelect={true}
        connectOnClick={true}
        connectionMode={ConnectionMode.Strict}
        disableKeyboardA11y={false}
        /* Connection Line */
        connectionRadius={24}
        connectionLineType={ConnectionLineType.Bezier}
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
        deleteSelectedNode={deleteSelectedNode}
      />
    </>
  );
};

export default FlowEditor;
