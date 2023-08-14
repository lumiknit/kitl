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
  path: string;
  defaultValue: node.NodeData;
  onChange?: (value: node.NodeData) => void;
  close?: () => void;
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
          onChange={updateValue}
        />
      );
    case node.NodeType.Lambda:
      return (
        <NodeEditorLambda
          value={state.value as node.LambdaNodeData}
          onChange={updateValue}
        />
      );
    case node.NodeType.Beta:
      return (
        <NodeEditorBeta
          value={state.value as node.BetaNodeData}
          onChange={updateValue}
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
  const [state, setState] = useState<NodeEditorState>(() => ({
    value: props.defaultValue,
    lastValue: props.defaultValue,
    editingType: props.defaultValue.type,
    literalState: literalEditor.initialState(props.defaultValue),
  }));

  const updateEditingType = useCallback((ty: node.NodeType) => {
    const newValue = node.convertNodeDataType(ty, state.value);
    setState(oldState => ({
      ...oldState,
      editingType: ty,
      value: newValue,
    }));
    props.onChange?.(newValue);
  }, []);

  const updateValue = useCallback((value: node.NodeData) => {
    setState(oldState => ({
      ...oldState,
      value: value,
      lastValue: value,
    }));
    props.onChange?.(value);
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

  const discard = useCallback(() => {
    setState(oldState => ({
      ...oldState,
      value: props.defaultValue,
    }));
    props.onChange?.(props.defaultValue);
    setTimeout(() => props.close?.(), 0);
  }, [props, setState]);

  const save = useCallback(() => {
    props.close?.();
  }, [props.close]);

  return (
    <div className="node-editor">
      <NodeEditorHeader
        path={props.path}
        value={state.value}
        editingType={state.editingType}
        discard={discard}
        save={save}
        onEditingTypeChange={updateEditingType}
      />
      <div className="node-editor-body">{body}</div>
    </div>
  );
};

export default NodeEditor;
