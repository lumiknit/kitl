import * as node from "../../common/node";

import NodeEditorHeader from "./NodeEditorHeader";

import "./NodeEditor.css";
import { useCallback, useState } from "react";
import NodeEditorComment from "./NodeEditorComment";
import NodeEditorLambda from "./NodeEditorLambda";
import NodeEditorBeta from "./NodeEditorBeta";
import NodeEditorLiteral from "./NodeEditorLiteral";
import * as literalEditor from "./NodeEditorLiteral";

export type NodeEditorProps = {
  closeBtnRef: React.RefObject<HTMLButtonElement>;
  path: string;
  defaultValue: node.NodeData;
  onChange?: (value: node.NodeData) => void;
  close?: (value: node.NodeData) => void;
};

export type NodeEditorState = {
  value: node.NodeData;
  lastValue: node.NodeData;
  editingType: node.NodeType;
  literalState: literalEditor.NodeEditorLiteralState;
};

const editorBody = (
  state: NodeEditorState,
  updateValue: (value: node.NodeData) => void,
  updateLiteralState: (s: literalEditor.NodeEditorLiteralState) => void,
) => {
  switch (state.editingType) {
    case node.NodeType.Comment:
      return (
        <NodeEditorComment
          value={state.value as node.CommentNodeData}
          updateValue={updateValue}
        />
      );
    case node.NodeType.Lambda:
      return (
        <NodeEditorLambda
          value={state.value as node.LambdaNodeData}
          updateValue={updateValue}
        />
      );
    case node.NodeType.Beta:
      return (
        <NodeEditorBeta
          value={state.value as node.BetaNodeData}
          updateValue={updateValue}
        />
      );
    case node.NodeType.Literal:
      return (
        <NodeEditorLiteral
          value={state.value as node.LiteralNodeData}
          updateValue={updateValue}
          state={state.literalState}
          updateState={updateLiteralState}
        />
      );
    default:
      return JSON.stringify(state.value);
  }
};

export const NodeEditor = (props: NodeEditorProps) => {
  const [state, setState] = useState<NodeEditorState>({
    value: props.defaultValue,
    lastValue: props.defaultValue,
    editingType: props.defaultValue.type,
    literalState: literalEditor.initialState(props.defaultValue),
  });

  const updateEditingType = useCallback((ty: node.NodeType) => {
    setState(oldState => ({
      ...oldState,
      editingType: ty,
      value: node.convertNodeDataType(ty, oldState.lastValue),
    }));
  }, []);

  const updateValue = useCallback((value: node.NodeData) => {
    setState(oldState => ({
      ...oldState,
      value: value,
      lastValue: value,
    }));
  }, []);

  const updateLiteralState = useCallback(
    (s: literalEditor.NodeEditorLiteralState) => {
      setState(oldState => ({
        ...oldState,
        literalState: s,
      }));
    },
    [],
  );

  const body = editorBody(state, updateValue, updateLiteralState);

  return (
    <div className="node-editor">
      <NodeEditorHeader
        closeBtnRef={props.closeBtnRef}
        path={props.path}
        value={state.value}
        editingType={state.editingType}
        discard={() => {
          if (props.close !== undefined) {
            props.close(props.defaultValue);
          }
        }}
        save={() => {
          if (props.close !== undefined) {
            props.close(node.cloneNodeData(state.value));
          }
        }}
        updateEditingType={updateEditingType}
      />
      <div className="node-editor-body">{body}</div>
    </div>
  );
};

export default NodeEditor;
