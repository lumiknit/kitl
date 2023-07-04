import { useEffect, useState } from "react";

import FlowEditorWrapper from "./FlowEditor/FlowEditorWrapper";
import JsonEditor from "./JsonEditor/JsonEditor";
import * as jh from "./JsonEditor/helper";

import "./EditorRoot.css";
import Modal from "./Modal/Modal";

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

export type EditorRootState = {
  jsonEditorState: JsonEditorState;
};

const EditorRoot = () => {
  const [state, setState] = useState<EditorRootState>({
    jsonEditorState: closedJsonEditorState,
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
    const newState = { ...state };
    newState.jsonEditorState = closedJsonEditorState;
    setState(newState);
  };

  const handleResize = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="editor-root">
      <Modal open={state.jsonEditorState.open} onClose={closeJsonEditor}>
        <JsonEditor
          path={state.jsonEditorState.path}
          valueBox={state.jsonEditorState.valueBox}
        />
      </Modal>
      <FlowEditorWrapper openJsonEditor={openJsonEditor} />
    </div>
  );
};

export default EditorRoot;
