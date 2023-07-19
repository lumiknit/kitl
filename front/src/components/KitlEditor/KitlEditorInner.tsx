import { useState } from "react";

import * as h from "../helper";

import FlowEditor from "../FlowEditor/FlowEditor";

import "./KitlEditor.css";

import JsonEditorModal from "../Modal/JsonEditorModal";
import CodeAreaModal from "../Modal/CodeAreaModal";
import OpNodeModal from "../Modal/OpNodeModal";

import * as kc from "./context";

export enum ModalEditorType {
  JsonEditor = "jsonEditorModal",
  CodeArea = "codeAreaModal",
  OpNode = "opNodeModal",
}

export type ModalEditorState = {
  type: ModalEditorType;
  path: string;
  defaultValue: any;
};

export type KitlEditorInnerState = {
  editingState: kc.KitlEditingState;
  modalEditorState?: ModalEditorState;
};

export type KitlEditorInnerProps = {
  innerHeight: number;
};

const KitlEditorInner = (_props: KitlEditorInnerProps) => {
  ((x) => x)(_props);
  const context = kc.newKitlContext("editor-main");
  const [state, setState] = useState<KitlEditorInnerState>({
    editingState: kc.emptyKitlEditingState(),
  });

  const openModal =
    (ty: ModalEditorType) => (path: string, defaultValue: any) => {
      return setState(oldState => ({
        ...oldState,
        modalEditorState: {
          type: ty,
          path: path,
          defaultValue: defaultValue,
        },
      }));
    };

  const closeModalWithValue = (path: string) => (value: any) => {
    kc.applySubEditing(context, path, value);
    setState(oldState => ({
      ...oldState,
      modalEditorState: undefined,
    }));
  };

  const onChange = (path: string) => (value: any) => {
    setState({
      ...state,
      editingState: kc.addValueChange(state.editingState, path, value),
    });
  };

  const modalOpened = state.modalEditorState !== undefined;

  let modal = null;
  if (state.modalEditorState !== undefined) {
    switch (state.modalEditorState?.type) {
      case ModalEditorType.JsonEditor:
        modal = (
          <JsonEditorModal
            open={true}
            onClose={closeModalWithValue(state.modalEditorState.path)}
            path={state.modalEditorState.path}
            defaultValue={state.modalEditorState.defaultValue}
            onChange={onChange(state.modalEditorState.path)}
          />
        );
        break;
      case ModalEditorType.CodeArea:
        modal = (
          <CodeAreaModal
            open={true}
            onClose={closeModalWithValue(state.modalEditorState.path)}
            path={state.modalEditorState.path}
            defaultValue={state.modalEditorState.defaultValue}
            onChange={onChange(state.modalEditorState.path)}
          />
        );
        break;
      case ModalEditorType.OpNode:
        modal = (
          <OpNodeModal
            open={true}
            onClose={closeModalWithValue(state.modalEditorState.path)}
            path={state.modalEditorState.path}
            defaultValue={state.modalEditorState.defaultValue}
          />
        );
        break;
      default:
        modal = null;
    }
  }

  const flowEditor = (
    <FlowEditor
      openJsonEditor={openModal(ModalEditorType.JsonEditor)}
      openCodeArea={openModal(ModalEditorType.CodeArea)}
      openOpNode={openModal(ModalEditorType.OpNode)}
      context={context.flowContext}
    />
  );
  if (h.isMobile()) {
    return (
      <div className="editor-root">
        {flowEditor}
        {modalOpened ? modal : null}
      </div>
    );
  } else {
    return (
      <div className="editor-root editor-root-wide">
        <div className="editor-root-wide-item editor-root-wide-item-left">
          {flowEditor}
        </div>
        {!modalOpened ? null : (
          <div className="editor-root-wide-item editor-root-wide-item-right full-modal">
            {modal}
          </div>
        )}
      </div>
    );
  }
};

export default KitlEditorInner;
