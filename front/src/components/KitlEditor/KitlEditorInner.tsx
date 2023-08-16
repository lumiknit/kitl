import { useCallback, useState } from "react";

import * as h from "../helper";
import * as key from "../../common/key";
import * as node from "../../common/node";

import FlowEditor from "../FlowEditor/FlowEditor";

import "./KitlEditor.css";

import { FlowContext } from "../FlowEditor/context";
import { Edge, ReactFlowInstance, useReactFlow } from "reactflow";
import { parsePath } from "../../client/path";
import KitlModals, * as km from "./KitlModals";

export enum ModalEditorType {
  NodeEditor = "nodeEditorModal",
  Browser = "browserModal",
}

type Props = {
  flowContext: FlowContext;
  setFlowContext: (ctx: FlowContext) => void;
};

const KitlEditorInner = (props: Props) => {
  const [modalState, setModalState] = useState<km.ModalProps>(
    km.emptyModalProps,
  );
  const instance = useReactFlow();

  const handleFlowEditorInit = (instance: ReactFlowInstance) => {
    props.flowContext.setGraph(instance, props.flowContext.emptyGraph());
  };

  const handleCloseModalWithValue = (value: node.NodeData) => {
    const path = parsePath(modalState.path);
    switch (path.kind) {
      case "nd":
        {
          const nodes = instance.getNodes();
          const availableHandles = node.nodeHandleSet(value);
          const empty: Edge[] = [];
          const removeUnusableEdges = (edges: Edge[]) =>
            edges.reduce((acc: Edge[], e: Edge): Edge[] => {
              if (
                e.target === path.path &&
                typeof e.targetHandle === "string" &&
                !availableHandles.has(e.targetHandle)
              ) {
                return acc;
              }
              if (e.source === path.path) {
                if (
                  typeof e.sourceHandle === "string" &&
                  !availableHandles.has(e.sourceHandle)
                ) {
                  return acc;
                }
                for (const n of nodes) {
                  if (n.id === e.source) {
                    e = { ...e, type: n.type };
                    break;
                  }
                }
              }
              acc.push(e);
              return acc;
            }, empty);
          props.flowContext.updateGraph(
            instance,
            props.flowContext.updateNodeDataCallback(path.path, value),
            removeUnusableEdges,
          );
        }
        break;
    }
    setModalState(km.emptyModalProps);
  };

  const openModal = useCallback(
    (ty: ModalEditorType) => (path: string, defaultValue: any) => {
      // Allocate new ID
      setModalState(() => ({
        id: key.genID(),
        type: ty,
        path: path,
        defaultValue: defaultValue,
      }));
    },
    [setModalState],
  );

  const flowEditor = (
    <FlowEditor
      openNodeEditor={openModal(ModalEditorType.NodeEditor)}
      openBrowser={() => openModal(ModalEditorType.Browser)("browser", null)}
      context={props.flowContext}
      onInit={handleFlowEditorInit}
    />
  );

  const modals = (
    <KitlModals
      flowContext={props.flowContext}
      setFlowContext={props.setFlowContext}
      onClose={handleCloseModalWithValue}
      {...modalState}
    />
  );

  const modalOpened = modalState.type !== km.ModalEditorType.Nothing;
  const isMobile = h.isMobile();

  return (
    <div className="editor-root editor-root-wide">
      <div className="editor-root-wide-item editor-root-wide-item-left">
        {flowEditor}
        {isMobile && modalOpened ? modals : null}
      </div>
      {!isMobile && modalOpened ? (
        <div className="editor-root-wide-item editor-root-wide-item-right full-modal">
          {modals}
        </div>
      ) : null}
    </div>
  );
};

export default KitlEditorInner;
