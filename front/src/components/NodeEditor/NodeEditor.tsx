import * as node from "../../common/node";

import NodeEditorHeader from "./NodeEditorHeader";

import "./NodeEditor.css";
import { ReactElement, useCallback, useState } from "react";
import NodeEditorComment from "./NodeEditorComment";
import NodeEditorLambda from "./NodeEditorLambda";
import NodeEditorBeta from "./NodeEditorBeta";
import NodeEditorLiteral from "./NodeEditorLiteral";
import * as literalEditor from "./NodeEditorLiteral";

export type NodeEditorProps = {
  closeBtnRef: React.RefObject<HTMLButtonElement>;
  path: string;
  defaultValue: node.NodeData;
  onChange: (value: node.NodeData) => void;
  close: (value: node.NodeData) => void;
};

export type NodeEditorState = {
  value: node.NodeData;
  lastValue: node.NodeData;
  editingType: node.NodeType;
  literalEditingType: literalEditor.LiteralEditingType;
};

const editorBody = (
  state: NodeEditorState,
  updateValue: (value: node.NodeData) => ReactElement,
  updateLiteralEditingType: (ty: literalEditor.LiteralEditingType) => void,
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
          editingType={state.literalEditingType}
          updateEditingType={updateLiteralEditingType}
        />
      );
    default:
      return JSON.stringify(state.value);
  }
}

export const NodeEditor = (props: NodeEditorProps) => {
  const [state, setState] = useState<NodeEditorState>({
    value: props.defaultValue,
    lastValue: props.defaultValue,
    editingType: props.defaultValue.type,
    literalEditingType: (
      props.defaultValue.type === node.NodeType.Literal ?
        literalEditor.guessEditingType((props.defaultValue as node.LiteralNodeData).value):
        literalEditor.LiteralEditingType.Raw
    ),
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

  const updateLiteralEditingType = useCallback((ty: literalEditor.LiteralEditingType) => {
    setState(oldState => ({
      ...oldState,
      literalEditingType: ty,
    }));
  }, []);

  const body = editorBody(
    state,
    updateValue,
    updateLiteralEditingType,
  );

  return (
    <div className="node-editor">
      <NodeEditorHeader
        closeBtnRef={props.closeBtnRef}
        path={props.path}
        value={state.value}
        editingType={state.editingType}
        discard={() => props.close(props.defaultValue)}
        save={() => props.close(node.cloneNodeData(state.value))}
        updateEditingType={updateEditingType}
      />
      <div className="node-editor-body">{body}</div>
    </div>
  );
};

export default NodeEditor;
