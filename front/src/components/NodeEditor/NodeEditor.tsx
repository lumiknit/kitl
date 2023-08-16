import { useCallback, useState } from "react";

import * as node from "../../common/node";

import NodeEditorHeader from "./NodeEditorHeader";

import "./NodeEditor.css";

import NodeEditorComment from "./NodeEditorComment";
import NodeEditorLambda from "./NodeEditorLambda";
import NodeEditorBeta from "./NodeEditorBeta";
import NodeEditorLiteral from "./NodeEditorLiteral";
import * as literalEditor from "./NodeEditorLiteral";
import { Callbacks } from "./types";

export type NodeEditorProps = {
  path: string;
  defaultValue: node.NodeData;
  callbacks: Callbacks;
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
      const value = node.convertNodeDataType(ty, state.lastValue);
      props.callbacks.onChange?.(value);
      setState(oldState => ({
        ...oldState,
        editingType: ty,
        value: value,
      }));
    },
    [props.callbacks, state, setState],
  );

  const handleChange = useCallback(
    (value: node.NodeData) => {
      setState(oldState => ({
        ...oldState,
        value: value,
        lastValue: value,
      }));
      props.callbacks.onChange?.(value);
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
      props.callbacks.onChange?.(v);
    },
    [state, setState],
  );

  const body = editorBody(state, handleChange, handleLiteralStateChange);

  return (
    <div className="node-editor">
      <NodeEditorHeader
        editingType={state.editingType}
        callbacks={props.callbacks}
        onEditingTypeChange={handleEditingTypeChange}
      />
      <div className="node-editor-body">{body}</div>
    </div>
  );
};

export default NodeEditor;
