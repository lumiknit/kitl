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
} from "reactflow";

import "reactflow/dist/style.css";
import "./FlowEditor.css";
import "./FlowEditorNode.scss";

import * as fh from "./helper";
import * as fc from "./context";

import nodeTypes from "./GraphComponents/node-types";
import edgeTypes from "./GraphComponents/edge-types";
import FlowEditorHeader from "./FlowEditorHeader";
import { BetaNodeData, emptyBetaNode } from "../../common/node";
import Fab from "../Helpers/Fab";
import { TbPlus } from "react-icons/tb";

const getID = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60 * 1000;
  const utcMS = now.getTime() + offset;
  const utcSec = Math.round(utcMS / 1000);
  const timeString = utcSec.toString(36);
  const randomString = Math.random().toString(36).substring(7);
  return `${timeString}-${randomString}`;
};

export type FlowEditorProps = {
  context: fc.FlowContext;
  openNodeEditor: (path: string, data: any) => void;
  openBrowser: () => void;
};

type FlowEditorState = {
  mode: fh.EditingMode;
};

const FlowEditor = (props: FlowEditorProps) => {
  const [state, setState] = useState<FlowEditorState>({
    mode: fh.EditingMode.Add,
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
    const nodes = props.context.instance.getNodes();
    const targetNode = params.target;
    const targetHandle = params.targetHandle;
    let sourceNodeType: string | undefined;
    nodes.forEach(n => {
      if (n.id === params.source) {
        sourceNodeType = n.type;
      }
    });
    props.context.setEdges(es => {
      // Remove any existing edges from the target handle
      const newEdges = es.filter(e => {
        return !(e.target === targetNode && e.targetHandle === targetHandle);
      });
      // Add the new edge
      (params as { [key: string]: any }).type = sourceNodeType ?? "default";
      return addEdge(params, newEdges);
    });
    props.context.setNodes(ns =>
      ns.map(n => {
        if (n.id !== targetNode) return n;
        if (n.type !== "beta") return n;
        const data = n.data as BetaNodeData;
        if (typeof targetHandle !== "string") return n;
        const argPrefix = "arg";
        if (!targetHandle.startsWith(argPrefix)) return n;
        const arg = parseInt(targetHandle.substring(argPrefix.length));
        if (isNaN(arg)) return n;
        const newNode = {
          ...n,
          data: {
            ...data,
            argc: Math.max(data.argc, arg + 1),
          },
        };
        return newNode;
      }),
    );
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
    updatingGraphError = false;
  };

  const onNodeDoubleClick: NodeMouseHandler = (_event, node: Node) => {
    // TODO: Edit node
    switch (node.type) {
      case "def":
        break;
      default:
        props.openNodeEditor("nd:" + node.id, {
          ...node.data,
          type: node.type,
        });
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

  const onDoubleClick = (event: React.MouseEvent) => {
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
    const newNode: Node = {
      id: getID(),
      type: "beta",
      data: emptyBetaNode(),
      position: {
        x: x,
        y: y,
      },
    };
    props.context.setNodes(nodes => [...nodes, newNode]);
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
        edgeTypes={edgeTypes}
        nodeOrigin={[0.5, 0.5]}
        /* Flow View */
        fitView
        minZoom={0.5}
        maxZoom={5}
        snapGrid={[8, 8]}
        snapToGrid
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
        onDoubleClick={onDoubleClick}
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
          gap={24}
          variant={BackgroundVariant.Cross}
        />
      </ReactFlow>
      <FlowEditorHeader
        mode={state.mode}
        updateMode={updateMode}
        addNode={addNode}
        deleteSelectedNode={deleteSelectedNode}
        openBrowser={props.openBrowser}
      />
      <Fab onClick={() => addNode("beta", emptyBetaNode())} icon={<TbPlus />} />
    </>
  );
};

export default FlowEditor;
