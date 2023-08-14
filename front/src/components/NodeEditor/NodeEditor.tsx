import { useCallback, useState } from "react";

import * as node from "../../common/node";

import NodeEditorHeader from "./NodeEditorHeader";

import "./NodeEditor.css";

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
  discard?: () => void;
};

export type NodeEditorState = {
  value: node.NodeData;
  lastValue: node.NodeData;
  editingType: node.NodeType;
  literalState: literalEditor.NodeEditorLiteralState;
};

const editorBody = (
  state: NodeEditorState,
  handleChange: (value: node.NodeData) => void,
  handleLiteralStateChange: (s: literalEditor.NodeEditorLiteralState) => void,
) => {
  switch (state.editingType) {
    case node.NodeType.Comment:
      return (
        <NodeEditorComment
          value={state.value as node.CommentNodeData}
          onChange={handleChange}
        />
      );
    case node.NodeType.Lambda:
      return (
        <NodeEditorLambda
          value={state.value as node.LambdaNodeData}
          onChange={handleChange}
        />
      );
    case node.NodeType.Beta:
      return (
        <NodeEditorBeta
          value={state.value as node.BetaNodeData}
          onChange={handleChange}
        />
      );
    case node.NodeType.Literal:
      return (
        <NodeEditorLiteral
          value={state.value as node.LiteralNodeData}
          onChange={handleChange}
          state={state.literalState}
          updateState={handleLiteralStateChange}
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

  const handleEditingTypeChange = useCallback(
    (ty: node.NodeType) => {
      const newValue = node.convertNodeDataType(ty, state.lastValue);
      setState(oldState => ({
        ...oldState,
        editingType: ty,
        value: newValue,
      }));
      props.onChange?.(newValue);
    },
    [state, setState],
  );

  const handleChange = useCallback(
    (value: node.NodeData) => {
      setState(oldState => ({
        ...oldState,
        value: value,
        lastValue: value,
      }));
      props.onChange?.(value);
    },
    [setState],
  );

  const handleLiteralStateChange = useCallback(
    (s: literalEditor.NodeEditorLiteralState, value?: node.LiteralNodeData) => {
      const v = value ?? (state.value as node.NodeData);
      setState(oldState => ({
        ...oldState,
        literalState: s,
        value: v,
      }));
    },
    [state, setState],
  );

  const body = editorBody(state, handleChange, handleLiteralStateChange);

  const discard = useCallback(() => {
    props.discard?.();
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
        onEditingTypeChange={handleEditingTypeChange}
      />
      <div className="node-editor-body">{body}</div>
    </div>
  );
};

export default NodeEditor;
