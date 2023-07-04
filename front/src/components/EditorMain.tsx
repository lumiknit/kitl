import { useState } from "react";
import { Node } from "reactflow";

import FlowEditor from "./FlowEditor/FlowEditor";
import * as jh from "./JsonEditor/helper";

import "./EditorMain.css";
import JsonEditorModal from "./Modal/JsonEditorModal";
import { useEmptyFlowContext } from "./FlowEditor/helper";
import CodeAreaModal from "./Modal/CodeAreaModal";

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

export type CodeAreaModal = {
  open: boolean;
  path: string;
  valueBox: string[];
};

const closedCodeAreaState: CodeAreaModal = {
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

export type EditorMainState = {
  jsonEditorState: JsonEditorState;
  codeAreaState: CodeAreaModal;
};

const EditorMain = () => {
  const context = useEmptyFlowContext("editor-main", "editor-main");
  const [state, setState] = useState<EditorMainState>({
    jsonEditorState: closedJsonEditorState,
    codeAreaState: closedCodeAreaState,
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
      context.setNodes(updateConstNodeData(id, value));
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
      context.setNodes(updateCommentNodeData(id, value));
    } catch (e) {
      console.warn("Failed to update value: " + e);
    }
    const newState = { ...state };
    newState.codeAreaState = closedCodeAreaState;
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
        valueBox={state.codeAreaState.valueBox}
      />
      {/* Main editor */}
      <FlowEditor
        openJsonEditor={openJsonEditor}
        openCodeArea={openCodeArea}
        context={context}
      />
    </div>
  );
};

export default EditorMain;
