import { useState } from "react";

import FlowEditor from "../FlowEditor/FlowEditor";

import "./KitlEditor.css";

import JsonEditorModal from "../Modal/JsonEditorModal";
import CodeAreaModal from "../Modal/CodeAreaModal";
import OpNodeModal from "../Modal/OpNodeModal";

import * as kc from "./context";

export type EditorModalState = {
  path: string;
  defaultValue: any;
};

export type KitlEditorInnerState = {
  editingState: kc.KitlEditingState;
  jsonEditorModal?: EditorModalState;
  codeAreaModal?: EditorModalState;
  opNodeModal?: EditorModalState;
};

const KitlEditorInner = () => {
  const context = kc.newKitlContext("editor-main");
  const [state, setState] = useState<KitlEditorInnerState>({
    editingState: kc.emptyKitlEditingState(),
  });

  const openModal = (key: string) => (path: string, defaultValue: any) => {
    return setState({
      ...state,
      [key]: {
        path: path,
        defaultValue: defaultValue,
      },
    });
  };

  const closeModal = (key: string) => () => {
    kc.applySubEditingState(context, state.editingState);
    setState({
      ...state,
      [key]: undefined,
    });
  };

  const onChange = (path: string) => (value: any) => {
    setState({
      ...state,
      editingState: kc.addValueChange(state.editingState, path, value),
    });
  };

  return (
    <div className="editor-root">
      {/* Modals */}
      {state.jsonEditorModal !== undefined ? (
        <JsonEditorModal
          open={true}
          onClose={closeModal("jsonEditorModal")}
          path={state.jsonEditorModal.path}
          defaultValue={state.jsonEditorModal.defaultValue}
          onChange={onChange(state.jsonEditorModal.path)}
        />
      ) : null}
      {state.codeAreaModal !== undefined ? (
        <CodeAreaModal
          open={true}
          onClose={closeModal("codeAreaModal")}
          path={state.codeAreaModal.path}
          defaultValue={state.codeAreaModal.defaultValue}
          onChange={onChange(state.codeAreaModal.path)}
        />
      ) : null}
      {state.opNodeModal !== undefined ? (
        <OpNodeModal
          open={true}
          onClose={closeModal("opNodeModal")}
          path={state.opNodeModal.path}
          defaultValue={state.opNodeModal.defaultValue}
          onChange={onChange(state.opNodeModal.path)}
        />
      ) : null}
      <FlowEditor
        openJsonEditor={openModal("jsonEditorModal")}
        openCodeArea={openModal("codeAreaModal")}
        openOpNode={openModal("opNodeModal")}
        context={context.flowContext}
      />
    </div>
  );
};

export default KitlEditorInner;
