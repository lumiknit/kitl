import { useState } from "react";

import "@popperjs/core";
import "bootstrap/dist/js/bootstrap.bundle";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./JsonEditor.css";

import * as jh from "./helper";
import * as jc from "./config";

import JsonEditorHeader from "./JsonEditorHeader";
import JsonItem from "./JsonItem";
import JsonTextArea from "./JsonTextArea";

import "bootstrap/dist/css/bootstrap.css";

import "./JsonEditor.css";
import "./JsonIndent.css";

type JsonEditorState = {
  // Mode
  mode: jc.EditMode;
  // Configs
  showStringEscape: boolean;
  // Other states
  valueBox: any[1];
  cnt: number;
};

const JsonEditor = () => {
  const [state, setState] = useState<JsonEditorState>({
    mode: jc.EditMode.Tree,
    showStringEscape: false,
    valueBox: [null],
    cnt: 0,
  });

  const updateValue = (value: any) => {
    state.valueBox[0] = value;
    console.log("JsonEditor.updateValue", value);
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
    <div className="test-wrap">
      <div className="json-editor">
        <JsonEditorHeader
          mode={state.mode}
          updateMode={updateMode}
          showStringEscape={state.showStringEscape}
          toggleStringEscape={toggleStringEscape}
        />
        <div className="json-editor-body">
          {jc.isTextMode(state.mode) ? (
            <JsonTextArea value={state.valueBox[0]} updateValue={updateValue} />
          ) : (
            <JsonItem
              index="root"
              value={state.valueBox[0]}
              depth={0}
              updateValue={updateValue}
              config={config}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonEditor;
