import { useState } from "react";

import "@popperjs/core";
import "bootstrap/dist/js/bootstrap.bundle";

import "bootstrap/dist/css/bootstrap.css";
import "./JsonEditor.css";
import "./JsonIndent.scss";

import * as jh from "./helper";
import { newContextValue } from "./JsonEditorContext";

import JsonEditorProvider from "./JsonEditorProvider";
import JsonEditorRoot from "./JsonEditorRoot";

<<<<<<< HEAD
type JsonEditorProps = {
  path?: string;
  defaultValue?: jh.Json;
  onChange?: (value: jh.Json) => void;
||||||| 3ee2a90
type JsonEditorState = {
  // Mode
  mode: jc.EditMode;
  // Configs
  showStringEscape: boolean;
  // Other states
  path: string;
  valueBox: jh.Json[];
  cnt: number;
=======
type JsonEditorProps = {
  path: string;
  valueBox: jh.Json[];
};

type JsonEditorState = {
  // Mode
  mode: jc.EditMode;
  // Configs
  showStringEscape: boolean;
  // Other states
  path: string;
  cnt: number;
>>>>>>> main
};

<<<<<<< HEAD
const JsonEditor = (props: JsonEditorProps) => {
  console.log("[RENDER] JsonEditor");
  const path = props.path !== undefined ? props.path : "";
  const value = props.defaultValue !== undefined ? props.defaultValue : null;
  const ctxVal = newContextValue(path, value);
  ctxVal.onValueChange = props.onChange;
  const [ctxValue, setCtxValue] = useState(ctxVal);
||||||| 3ee2a90
const getFilenameFromState = (state: JsonEditorState) => {
  // Split by slash
  const path =
    state.path === "" ? "noname" : state.path.split("/").slice(-1)[0];
  // If extension is not json, append it
  return path.endsWith(".json") ? path : path + ".json";
};

const JsonEditor = () => {
  const [state, setState] = useState<JsonEditorState>({
    mode: jc.EditMode.Tree,
    showStringEscape: false,
    path: "",
    valueBox: [null],
    cnt: 0,
  });

  const updateValue = (value: jh.Json) => {
    state.valueBox[0] = value;
  };

  // Header callbacks
  const updateMode = (mode: jc.EditMode) => {
    const newState = { ...state };
    newState.mode = mode;
    setState(newState);
  };

  const toggleStringEscape = () => {
    const newState = { ...state };
    newState.showStringEscape = !newState.showStringEscape;
    setState(newState);
  };

  // Items config
  const config: jc.Config = {
    editMode: state.mode,
    showStringEscape: state.showStringEscape,
  };

=======
const getFilenameFromState = (state: JsonEditorState) => {
  // Split by slash
  const path =
    state.path === "" ? "noname" : state.path.split("/").slice(-1)[0];
  // If extension is not json, append it
  return path.endsWith(".json") ? path : path + ".json";
};

const JsonEditor = (props: JsonEditorProps) => {
  const [state, setState] = useState<JsonEditorState>({
    mode: jc.EditMode.Tree,
    showStringEscape: false,
    path: props.path,
    cnt: 0,
  });

  const updateValue = (value: jh.Json) => {
    props.valueBox[0] = value;
  };

  // Header callbacks
  const updateMode = (mode: jc.EditMode) => {
    const newState = { ...state };
    newState.mode = mode;
    setState(newState);
  };

  const toggleStringEscape = () => {
    const newState = { ...state };
    newState.showStringEscape = !newState.showStringEscape;
    setState(newState);
  };

  // Items config
  const config: jc.Config = {
    editMode: state.mode,
    showStringEscape: state.showStringEscape,
  };

>>>>>>> main
  return (
<<<<<<< HEAD
    <JsonEditorProvider ctx={ctxValue} setCtx={setCtxValue}>
      <JsonEditorRoot />
    </JsonEditorProvider>
||||||| 3ee2a90
    <div className="test-wrap">
      <div className="json-editor">
        <JsonEditorHeader
          mode={state.mode}
          updateMode={updateMode}
          showStringEscape={state.showStringEscape}
          toggleStringEscape={toggleStringEscape}
          downloadJson={() => {
            const filename = getFilenameFromState(state);
            const content = JSON.stringify(state.valueBox[0]);
            utils.downloadTextFile(filename, content);
          }}
        />
        <div className="json-editor-body">
          {jc.isTextMode(state.mode) ? (
            <JsonTextArea value={state.valueBox[0]} updateValue={updateValue} />
          ) : (
            <JsonItem
              position={new jh.Position(0, "", "")}
              value={state.valueBox[0]}
              updateValue={updateValue}
              config={config}
            />
          )}
        </div>
      </div>
    </div>
=======
    <div className="json-editor">
      <JsonEditorHeader
        path={state.path}
        mode={state.mode}
        updateMode={updateMode}
        showStringEscape={state.showStringEscape}
        toggleStringEscape={toggleStringEscape}
        downloadJson={() => {
          const filename = getFilenameFromState(state);
          const content = JSON.stringify(props.valueBox[0]);
          utils.downloadTextFile(filename, content);
        }}
      />
      <div className="json-editor-body">
        {jc.isTextMode(state.mode) ? (
          <JsonTextArea value={props.valueBox[0]} updateValue={updateValue} />
        ) : (
          <JsonItem
            position={new jh.Position(0, "", "")}
            updateIndex={() => {
              alert("Cannot update index of root object!");
              throw new Error("Cannot update index of root object!");
            }}
            value={props.valueBox[0]}
            updateValue={updateValue}
            config={config}
          />
        )}
      </div>
    </div>
>>>>>>> main
  );
};

export default JsonEditor;
