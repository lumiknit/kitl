// Editing Mode

import { Dispatch, SetStateAction } from "react";
import {
  Edge,
  Node,
  OnEdgesChange,
  OnNodesChange,
  useEdgesState,
  useNodesState,
} from "reactflow";

export enum EditingMode {
  File = 0,
  AddNode = 1,
  Edit = 2,
}

export const editingModeLabels = ["File", "Add Node", "Edit"];

export const editingModeIcons = [
  "file-earmark-text",
  "plus-square",
  "pencil-square",
];

// Create node

export type FlowContext = {
  name: string;
  path: string;

  nodes: Node[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  onNodesChange: OnNodesChange;

  edges: Edge[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  onEdgesChange: OnEdgesChange;
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

export const useEmptyFlowContext = (
  name: string,
  path: string
): FlowContext => {
  const initNodes: Node[] = [defNode(name)];
  const initEdges: Edge[] = [];
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  return {
    name,
    path,
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
  };
};
