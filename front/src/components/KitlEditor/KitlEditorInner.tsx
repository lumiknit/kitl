import { useState } from "react";
import { Node } from "reactflow";

import FlowEditor from "../FlowEditor/FlowEditor";
import * as jh from "../JsonEditor/helper";

import "./KitlEditor.css";

import JsonEditorModal from "../Modal/JsonEditorModal";
import CodeAreaModal from "../Modal/CodeAreaModal";
import OpNodeModal from "../Modal/OpNodeModal";

import * as kc from "./context";

export type JsonEditorState = {
  open: boolean;
  path: string;
  valueBox: jh.Json[];
};

const closedJsonEditorState: JsonEditorState = {
  open: false,
  path: "",
  valueBox: [],
};

export type CodeAreaState = {
  open: boolean;
  path: string;
  valueBox: string[];
};

const closedCodeAreaState: CodeAreaState = {
  open: false,
  path: "",
  valueBox: [],
};

export type OpNodeState = {
  open: boolean;
  path: string;
  valueBox: string[];
};

const closedOpNodeState: OpNodeState = {
  open: false,
  path: "",
  valueBox: [],
};

const parsePath = (path: string) => {
  const splitted = path.split(":");
  if (splitted.length === 1) {
    return ["a", splitted[0]];
  } else if (splitted.length === 2) {
    return [splitted[0], splitted[1]];
  } else {
    throw new Error("Invalid path: " + path);
  }
};

const updateConstNodeData = (id: string, value: jh.Json) => (nodes: Node[]) =>
  nodes.map(node => {
    if (node.id !== id) return node;
    return {
      ...node,
      data: value,
    };
  });

const updateCommentNodeData = (id: string, value: string) => (nodes: Node[]) =>
  nodes.map(node => {
    if (node.id !== id) return node;
    return {
      ...node,
      data: value,
    };
  });

const updateOpNodeData =
  (id: string, mod: string, name: string) => (nodes: Node[]) =>
    nodes.map(node => {
      if (node.id !== id) return node;
      return {
        ...node,
        data: {
          module: mod,
          name: name,
        },
      };
    });

export type KitlEditorInnerState = {
  jsonEditorState: JsonEditorState;
  codeAreaState: CodeAreaState;
  opNodeState: OpNodeState;
};

const KitlEditorInner = () => {
  const context = kc.newKitlContext("editor-main", "editor-main");

  const [state, setState] = useState<KitlEditorInnerState>({
    jsonEditorState: closedJsonEditorState,
    codeAreaState: closedCodeAreaState,
    opNodeState: closedOpNodeState,
  });

  const openJsonEditor = (path: string, data: any) => {
    const newState = { ...state };
    newState.jsonEditorState = {
      open: true,
      path: path,
      valueBox: [JSON.parse(JSON.stringify(data))],
    };
    setState(newState);
  };

  const closeJsonEditor = () => {
    try {
      const [pType, id] = parsePath(state.jsonEditorState.path);
      if (pType !== "nd-c") {
        throw new Error(
          "Path is not correct, do not update value: " +
            state.jsonEditorState.path
        );
      }
      const value = state.jsonEditorState.valueBox[0];
      context.flowContext.setNodes(updateConstNodeData(id, value));
    } catch (e) {
      console.warn("Failed to update value: " + e);
    }
    const newState = { ...state };
    newState.jsonEditorState = closedJsonEditorState;
    setState(newState);
  };

  const openCodeArea = (path: string, data: string) => {
    const newState = { ...state };
    newState.codeAreaState = {
      open: true,
      path: path,
      valueBox: [data],
    };
    setState(newState);
  };

  const onChangeCodeArea = (value: string) => {
    state.codeAreaState.valueBox[0] = value;
  };

  const closeCodeArea = () => {
    try {
      const [pType, id] = parsePath(state.codeAreaState.path);
      if (pType !== "nd-cmt") {
        throw new Error(
          "Path is not correct, do not update value: " +
            state.codeAreaState.path
        );
      }
      const value = state.codeAreaState.valueBox[0];
      context.flowContext.setNodes(updateCommentNodeData(id, value));
    } catch (e) {
      console.warn("Failed to update value: " + e);
    }
    const newState = { ...state };
    newState.codeAreaState = closedCodeAreaState;
    setState(newState);
  };

  const openOpNode = (path: string, data: { module: string; name: string }) => {
    const newState = { ...state };
    newState.opNodeState = {
      open: true,
      path: path,
      valueBox: [data.module, data.name],
    };
    setState(newState);
  };

  const closeOpNode = () => {
    try {
      const [pType, id] = parsePath(state.opNodeState.path);
      if (pType !== "nd-op") {
        throw new Error(
          "Path is not correct, do not update value: " +
            state.codeAreaState.path
        );
      }
      const mod = state.opNodeState.valueBox[0];
      const name = state.opNodeState.valueBox[1];
      context.flowContext.setNodes(updateOpNodeData(id, mod, name));
    } catch (e) {
      console.warn("Failed to update value: " + e);
    }
    const newState = { ...state };
    newState.opNodeState = closedOpNodeState;
    setState(newState);
  };

  return (
    <div className="editor-root">
      {/* Modals */}
      <JsonEditorModal
        open={state.jsonEditorState.open}
        onClose={closeJsonEditor}
        path={state.jsonEditorState.path}
        valueBox={state.jsonEditorState.valueBox}
      />
      <CodeAreaModal
        open={state.codeAreaState.open}
        onClose={closeCodeArea}
        path={state.codeAreaState.path}
        defaultValue={state.codeAreaState.valueBox[0]}
        onChange={onChangeCodeArea}
      />
      <OpNodeModal
        open={state.opNodeState.open}
        onClose={closeOpNode}
        path={state.opNodeState.path}
        valueBox={state.opNodeState.valueBox}
      />
      {/* Main editor */}
      <FlowEditor
        openJsonEditor={openJsonEditor}
        openCodeArea={openCodeArea}
        openOpNode={openOpNode}
        context={context.flowContext}
      />
    </div>
  );
};

export default KitlEditorInner;
