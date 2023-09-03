import { MouseEventHandler, useCallback, useMemo, useState } from "react";

import ReactFlow, {
  Background,
  BackgroundVariant,
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
  NodeChange,
  NodeSelectionChange,
  Connection,
  EdgeSelectionChange,
  EdgeChange,
} from "reactflow";

import "reactflow/dist/style.css";
import "./FlowEditor.css";
import "./FlowEditorNode.scss";

import * as node from "../../common/node";
import * as helper from "./helper";
import * as context from "./context";

import nodeTypes from "./GraphComponents/node-types";
import edgeTypes from "./GraphComponents/edge-types";
import FlowEditorHeader from "./FlowEditorHeader";
import Fab from "../Helpers/Fab";
import { TbPlus } from "react-icons/tb";
import toast from "react-hot-toast";

export type FlowEditorProps = {
  context: context.FlowContext;
  openNodeEditor: (path: string, data: any) => void;
  openBrowser: () => void;
  openGraphTools: () => void;

  onInit?: (instance: ReactFlowInstance) => void;
};

type FlowEditorState = {
  mode: helper.EditingMode;
};

const FlowEditor = (props: FlowEditorProps) => {
  const storeApi = useStoreApi();
  const instance = useReactFlow();

  const ctxI = useMemo<context.FlowContextI>(
    () => new context.FlowContextI(props.context, instance, storeApi),
    [props.context, instance, storeApi],
  );

  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges, , onEdgesChange] = useEdgesState([]);

  const [state, setState] = useState<FlowEditorState>({
    mode: helper.EditingMode.Add,
  });

  // Node Change wrapper

  const onNodesChangeSelection = useCallback(
    (nc: NodeChange[]) =>
      onNodesChange(
        nc.filter(
          n =>
            n.type !== "select" || (n as NodeSelectionChange).selected === true,
        ),
      ),
    [onNodesChange],
  );

  const onEdgesChangeSelection = useCallback(
    (ec: EdgeChange[]) =>
      onEdgesChange(
        ec.filter(
          e =>
            e.type !== "select" || (e as EdgeSelectionChange).selected === true,
        ),
      ),
    [onEdgesChange],
  );

  let handleNodesChange = onNodesChange;
  let handleEdgesChange = onEdgesChange;
  if (state.mode === helper.EditingMode.Selection) {
    handleNodesChange = onNodesChangeSelection;
    handleEdgesChange = onEdgesChangeSelection;
  }
  // Helpers
  const addNode = useCallback(() => {
    const n = ctxI.addEmptyNode();
    props.openNodeEditor("nd:" + n.id, n.data);
  }, [ctxI]);

  // Handlers

  const handleInit = useCallback(
    (instance: ReactFlowInstance) => {
      if (props.onInit) props.onInit(instance);
    },
    [props.onInit],
  );

  const handleError = useCallback((code: string, message: string) => {
    console.error(code, message);
    toast.error(`[${code}] ${message}`);
  }, []);

  const handleConnect = useCallback(
    (params: Connection | Edge) => ctxI.handleConnect(params),
    [ctxI],
  );

  const handleDoubleClick: MouseEventHandler = useCallback(
    event => {
      const target = event.target as HTMLElement;
      if (!target.classList.contains("react-flow__pane")) return;
      event.preventDefault();
      const {
        transform: [tx, ty, zoom],
      } = storeApi.getState();
      // Calculate clicked position
      const zoomMultiplier = 1 / zoom;
      const x = (event.clientX - tx) * zoomMultiplier;
      const y = (event.clientY - ty) * zoomMultiplier;
      const n = ctxI.addEmptyNodeAt(x, y);
      props.openNodeEditor("nd:" + n.id, n.data);
    },
    [ctxI],
  );

  const handleNodeDoubleClick: NodeMouseHandler = (_event, n: Node) => {
    if (n.type === node.NodeType.Def) return;
    props.openNodeEditor("nd:" + n.id, n.data);
  };

  const handleEdgeDoubleClick: EdgeMouseHandler = useCallback(
    (_event, edge: Edge) => {
      ctxI.deleteEdge(edge.id);
    },
    [ctxI],
  );

  const updateMode = useCallback(
    (mode: helper.EditingMode) => {
      setState(oldState => ({
        ...oldState,
        mode: mode,
      }));
    },
    [setState],
  );

  return (
    <>
      <ReactFlow
        /* Basic props */
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodeOrigin={[0.0, 0.0]}
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
        onInit={handleInit}
        onError={handleError}
        onDoubleClick={handleDoubleClick}
        /* Node Event Handler */
        onNodeDoubleClick={handleNodeDoubleClick}
        /* Edge Event Handler */
        onEdgeDoubleClick={handleEdgeDoubleClick}
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
      </ReactFlow>
      <FlowEditorHeader
        flowContext={props.context}
        mode={state.mode}
        updateMode={updateMode}
        openBrowser={props.openBrowser}
        openGraphTools={props.openGraphTools}
      />
      <Fab onClick={addNode} icon={<TbPlus />} />
    </>
  );
};

export default FlowEditor;
