import * as node from "../../common/node";

import NodeEditorHeader from "./NodeEditorHeader";

import "./NodeEditor.css";
import { useCallback, useState } from "react";
import NodeEditorComment from "./NodeEditorComment";
import NodeEditorLambda from "./NodeEditorLambda";
import NodeEditorBeta from "./NodeEditorBeta";

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
};

export const NodeEditor = (props: NodeEditorProps) => {
  const [state, setState] = useState<NodeEditorState>({
    value: props.defaultValue,
    lastValue: props.defaultValue,
    editingType: props.defaultValue.type,
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

  let editorBody;
  switch (state.editingType) {
    case node.NodeType.Comment:
      editorBody = (
        <NodeEditorComment
          value={state.value as node.CommentNodeData}
          updateValue={updateValue}
        />
      );
      break;
    case node.NodeType.Lambda:
      editorBody = (
        <NodeEditorLambda
          value={state.value as node.LambdaNodeData}
          updateValue={updateValue}
        />
      );
      break;
    case node.NodeType.Beta:
      editorBody = (
        <NodeEditorBeta
          value={state.value as node.BetaNodeData}
          updateValue={updateValue}
        />
      );
      break;
    default:
      editorBody = JSON.stringify(state.value);
  }

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
      <div className="node-editor-body">{editorBody}</div>
    </div>
  );
};

export default NodeEditor;
