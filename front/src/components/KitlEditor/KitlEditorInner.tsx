import { useCallback, useState } from "react";

import * as h from "../helper";

import FlowEditor from "../FlowEditor/FlowEditor";

import "./KitlEditor.css";

import { FlowContext } from "../FlowEditor/context";
import BrowserModal from "../Modal/BrowserModal";
import NodeEditorModal from "../NodeEditor/NodeEditorModal";
import { ReactFlowInstance, useReactFlow } from "reactflow";
import { parsePath } from "../../client/path";

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
  flowContext: FlowContext;
  modalEditorState?: ModalEditorState;
};

const KitlEditorInner = () => {
  const instance = useReactFlow();
  const [state, setState] = useState<KitlEditorInnerState>(() => ({
    flowContext: new FlowContext(
      "scratch",
      "/temp",
      128
    ),
  }));

  const handleFlowEditorInit = (instance: ReactFlowInstance) => {
    state.flowContext.setGraph(
      instance,
      state.flowContext.emptyGraph(),
    );
  };

  const isMobile = h.isMobile();

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
    const path = parsePath(state.modalEditorState.path);
    switch(path.kind) {
      case "nd": {
        state.flowContext.setNodes(
          instance,
          state.flowContext.updateNodeDataCallback(
            path.path,
            value
          )
        )
      } break;
    }
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
      context={state.flowContext}
      onInit={handleFlowEditorInit}
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
