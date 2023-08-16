import { useCallback, useState } from "react";

import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Node,
  Edge,
  NodeMouseHandler,
  EdgeMouseHandler,
  useStoreApi,
  SelectionMode,
  ConnectionMode,
  ConnectionLineType,
  useEdgesState,
  useNodesState,
  useReactFlow,
  ReactFlowInstance,
  addEdge,
} from "reactflow";

import "reactflow/dist/style.css";
import "./FlowEditor.css";
import "./FlowEditorNode.scss";

import * as key from "../../common/key";
import * as node from "../../common/node";
import * as helper from "./helper";
import * as context from "./context";

import nodeTypes from "./GraphComponents/node-types";
import edgeTypes from "./GraphComponents/edge-types";
import FlowEditorHeader from "./FlowEditorHeader";
import { emptyBetaNode } from "../../common/node";
import Fab from "../Helpers/Fab";
import { TbPlus } from "react-icons/tb";
import toast from "react-hot-toast";

export type FlowEditorProps = {
  context: context.FlowContext;
  openNodeEditor: (path: string, data: any) => void;
  openBrowser: () => void;

  onInit?: (instance: ReactFlowInstance) => void;
};

type FlowEditorState = {
  mode: helper.EditingMode;
};

const FlowEditor = (props: FlowEditorProps) => {
  const storeApi = useStoreApi();
  const instance = useReactFlow();

  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [state, setState] = useState<FlowEditorState>({
    mode: helper.EditingMode.Add,
  });

  const onInit = useCallback(
    (instance: ReactFlowInstance) => {
      if (props.onInit) props.onInit(instance);
    },
    [props.onInit],
  );

  const onError = useCallback((code: string, message: string) => {
    console.error(code, message);
    toast.error(`[${code}] ${message}`);
  }, []);

  const onConnect = useCallback((params: Connection | Edge) => {
    const edge = params as Edge;
    setEdges(es => addEdge(edge, es));
  }, []);

  const onNodeDoubleClick: NodeMouseHandler = (_event, n: Node) => {
    if (n.type === node.NodeType.Def) return;
    props.openNodeEditor("nd:" + n.id, n.data);
  };

  const onEdgeDoubleClick: EdgeMouseHandler = (_event, edge: Edge) => {
    // Remove the edge
    setEdges(es => es.filter(e => e.id !== edge.id));
  };

  const updateMode = useCallback(
    (mode: helper.EditingMode) => {
      setState(oldState => ({
        ...oldState,
        mode: mode,
      }));
    },
    [setState],
  );

  const addNode = (type: string, data: any) => {
    // Find viewport center
    const state = storeApi.getState();
    const [x, y] = props.context.getCenter(state);
    const newNode: Node = {
      id: key.genID(),
      type: type,
      data: data,
      position: {
        x: x,
        y: y,
      },
    };
    props.context.setNodes(instance, ns => [...ns, newNode]);
  };

  return (
    <>
      <ReactFlow
        /* Basic props */
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodeOrigin={[0.5, 0.5]}
        /* Flow View */
        fitView
        minZoom={0.5}
        maxZoom={5}
        /*onlyRenderVisibleElements*/
        translateExtent={[
          [-1024, -1024],
          [Infinity, Infinity],
        ]}
        nodeExtent={[
          [-Infinity, -Infinity],
          [Infinity, Infinity],
        ]}
        /* Edge Specific */
        edgeUpdaterRadius={16}
        edgesUpdatable={true}
        defaultEdgeOptions={{
          animated: false,
          /*markerEnd: {
            type: MarkerType.ArrowClosed,
          },*/
        }}
        /* General Event Handler */
        onInit={onInit}
        onError={onError}
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
        connectionRadius={28}
        connectionLineType={ConnectionLineType.Bezier}
        /* Badge */
        attributionPosition="top-center">
        <Controls />
        <Background
          color="#44f2"
          size={4}
          gap={32}
          variant={BackgroundVariant.Cross}
        />
      </ReactFlow>
      <FlowEditorHeader
        flowContext={props.context}
        mode={state.mode}
        updateMode={updateMode}
        openBrowser={props.openBrowser}
      />
      <Fab onClick={() => addNode("beta", emptyBetaNode())} icon={<TbPlus />} />
    </>
  );
};

export default FlowEditor;
