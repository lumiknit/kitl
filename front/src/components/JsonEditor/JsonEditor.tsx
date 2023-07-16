import { useState } from "react";

import "@popperjs/core";
import "bootstrap/dist/js/bootstrap.bundle";

import "bootstrap/dist/css/bootstrap.css";
import "./JsonEditor.css";
import "./JsonIndent.scss";

import * as je from "./edit";
import * as jh from "./helper";
import { newContextValue } from "./JsonEditorContext";

import JsonEditorProvider from "./JsonEditorProvider";
import JsonEditorRoot from "./JsonEditorRoot";

type JsonEditorProps = {
  path?: string;
  defaultValue?: jh.Json;
  onChange?: (value: jh.Json) => void;
  close?: (value: jh.Json) => void;
  closeBtnRef: React.RefObject<HTMLButtonElement>;
};

const JsonEditorS = (props: JsonEditorProps) => {
  const value = props.defaultValue !== undefined ? props.defaultValue : null;
  const [editing, setEditing] = useState<je.JsonEdit>(je.newJsonEdit(value));
  if (editing.oldValue !== editing.value && props.onChange !== undefined) {
    /*props.onChange(editing.value);*/
    editing.oldValue = editing.value;
  }
  return (
    <>
      <JsonEditorRoot editing={editing} updateEditing={setEditing} />
      <button
        type="button"
        className="hidden"
        hidden={true}
        ref={props.closeBtnRef}
        onClick={() => {
          if (props.close !== undefined) props.close(editing.value);
        }}
      />
    </>
  );
};

const JsonEditor = (props: JsonEditorProps) => {
  const path = props.path !== undefined ? props.path : "";

  // Context Value State
  const ctxVal = newContextValue(path);
  const [ctxValue, setCtxValue] = useState(ctxVal);
  ctxValue.close = props.close;

  // Editing State

  return (
    <JsonEditorProvider ctx={ctxValue} setCtx={setCtxValue}>
      <JsonEditorS {...props} />
    </JsonEditorProvider>
  );
};

export default JsonEditor;
