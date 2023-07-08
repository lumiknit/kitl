import { useState } from "react";

import "@popperjs/core";
import "bootstrap/dist/js/bootstrap.bundle";

import "bootstrap/dist/css/bootstrap.css";
import "./JsonEditor.css";

import * as jh from "./helper";
import {
  newContextValue,
} from "./JsonEditorContext";

import JsonEditorProvider from "./JsonEditorProvider";
import JsonEditorRoot from "./JsonEditorRoot";

type JsonEditorProps = {
  path?: string;
  defaultVaule?: jh.Json;
  onChange?: (value: jh.Json) => void;
};

const JsonEditor = (props: JsonEditorProps) => {
  console.log("[RENDER] JsonEditor");
  const path = props.path !== undefined ? props.path : "";
  const value = props.defaultVaule !== undefined ? props.defaultVaule : null;
  const [ctxValue, setCtxValue] = useState(newContextValue(
    path,
    value,
  ));
  if(props.onChange !== undefined) {
    props.onChange(ctxValue.edit.value);
  }
  return (
    <JsonEditorProvider
      ctx={ctxValue}
      setCtx={setCtxValue}
    >
      <JsonEditorRoot />
    </JsonEditorProvider>
  );

};

export default JsonEditor;
