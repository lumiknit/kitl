import React, { createContext, useContext } from "react";

import {
  JsonEditorContext,
  JsonEditorContextValue,
  newContextValue,
} from "./JsonEditorContext";

// -- Context and Provider

const Context = createContext(
  new JsonEditorContext(newContextValue(""), () => {
    return;
  }),
);

export const useJsonEditorContext = () => useContext(Context);

type JsonEditorProviderProps = {
  ctx: JsonEditorContextValue;
  setCtx: (ctx: JsonEditorContextValue) => void;

  children: React.ReactNode | React.ReactNode[];
};

const JsonEditorProvider = (props: JsonEditorProviderProps) => {
  return (
    <Context.Provider value={new JsonEditorContext(props.ctx, props.setCtx)}>
      {props.children}
    </Context.Provider>
  );
};

export default JsonEditorProvider;
