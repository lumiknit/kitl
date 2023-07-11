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

type JsonEditorProps = {
  path?: string;
  defaultValue?: jh.Json;
  onChange?: (value: jh.Json) => void;
};

const JsonEditor = (props: JsonEditorProps) => {
  console.log("[RENDER] JsonEditor");
  const path = props.path !== undefined ? props.path : "";
  const value = props.defaultValue !== undefined ? props.defaultValue : null;
  const ctxVal = newContextValue(path, value);
  ctxVal.onValueChange = props.onChange;
  const [ctxValue, setCtxValue] = useState(ctxVal);
  return (
    <JsonEditorProvider ctx={ctxValue} setCtx={setCtxValue}>
      <JsonEditorRoot />
    </JsonEditorProvider>
  );
};

export default JsonEditor;
