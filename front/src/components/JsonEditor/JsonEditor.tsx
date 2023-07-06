import { useState } from "react";

import "@popperjs/core";
import "bootstrap/dist/js/bootstrap.bundle";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./JsonEditor.css";

import * as jh from "./helper";
import * as jc from "./JsonEditorContext";
import * as je from "./edit";
je.test();
import * as utils from "./utils";

import JsonEditorHeader from "./JsonEditorHeader";
import JsonItem from "./JsonItem";
import JsonTextArea from "./JsonTextArea";

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
};

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

  return (
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
  );
};

export default JsonEditor;
