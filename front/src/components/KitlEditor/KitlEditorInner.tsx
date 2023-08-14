import { useCallback, useState } from "react";

import * as h from "../helper";

import FlowEditor from "../FlowEditor/FlowEditor";

import "./KitlEditor.css";

import * as kc from "./context";
import BrowserModal from "../Modal/BrowserModal";
import NodeEditorModal from "../NodeEditor/NodeEditorModal";

export enum ModalEditorType {
  NodeEditor = "nodeEditorModal",
  Browser = "browserModal",
}

type ModalEditorState = {
  type: ModalEditorType;
  path: string;
  defaultValue: any;
};

type KitlEditorInnerState = {
  editingState: kc.KitlEditingState;
  modalEditorState?: ModalEditorState;
};

const KitlEditorInner = () => {
  const isMobile = h.isMobile();
  const context = kc.newKitlContext("editor-main");
  const [state, setState] = useState<KitlEditorInnerState>({
    editingState: kc.emptyKitlEditingState(),
  });

  const closeModal = useCallback(() => {
    setState(oldState => ({
      ...oldState,
      modalEditorState: undefined,
    }));
  }, [setState]);

  const closeModalWithValue = (value: any) => {
    if (state.modalEditorState === undefined) {
      return;
    }
    kc.applySubEditing(context, state.modalEditorState.path, value);
    setState(oldState => ({
      ...oldState,
      modalEditorState: undefined,
    }));
  };

  const openModal = useCallback(
    (ty: ModalEditorType) => (path: string, defaultValue: any) => {
      closeModal();
      setTimeout(
        () =>
          setState(oldState => ({
            ...oldState,
            modalEditorState: {
              type: ty,
              path: path,
              defaultValue: defaultValue,
            },
          })),
        0,
      );
    },
    [closeModal, setState],
  );

  const modalOpened = state.modalEditorState !== undefined;

  let modal = null;
  if (state.modalEditorState !== undefined) {
    switch (state.modalEditorState?.type) {
      case ModalEditorType.NodeEditor:
        modal = (
          <NodeEditorModal
            open={true}
            onClose={closeModalWithValue}
            path={state.modalEditorState.path}
            defaultValue={state.modalEditorState.defaultValue}
          />
        );
        break;
      case ModalEditorType.Browser:
        modal = (
          <BrowserModal
            open={true}
            onClose={closeModalWithValue}
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
      openNodeEditor={openModal(ModalEditorType.NodeEditor)}
      openBrowser={() => openModal(ModalEditorType.Browser)("browser", null)}
      context={context.flowContext}
    />
  );
  return (
    <div className="editor-root editor-root-wide">
      <div className="editor-root-wide-item editor-root-wide-item-left">
        {flowEditor}
        {isMobile && modalOpened ? modal : null}
      </div>
      {!isMobile && modalOpened ? (
        <div className="editor-root-wide-item editor-root-wide-item-right full-modal">
          {modal}
        </div>
      ) : null}
    </div>
  );
};

export default KitlEditorInner;
