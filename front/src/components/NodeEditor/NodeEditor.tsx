import * as node from "../../common/node";

import NodeEditorHeader from "./NodeEditorHeader";

import "./NodeEditor.css";
import { useCallback, useState } from "react";
import NodeEditorComment from "./NodeEditorComment";

export type NodeEditorProps = {
  closeBtnRef: React.RefObject<HTMLButtonElement>;
  path: string;
  defaultValue: node.NodeData;
  onChange: (value: node.NodeData) => void;
  close: (value: node.NodeData) => void;
};

export type NodeEditorState = {
  value: node.NodeData;
  editingType: node.NodeType;
};

export const NodeEditor = (props: NodeEditorProps) => {
  const [state, setState] = useState<NodeEditorState>({
    value: props.defaultValue,
    editingType: props.defaultValue.type,
  });

  const updateEditingType = useCallback((ty: node.NodeType) => {
    setState(oldState => ({
      ...oldState,
      editingType: ty,
    }));
  }, []);

  const updateValue = useCallback((value: node.NodeData) => {
    setState(oldState => ({
      ...oldState,
      value: value,
    }));
  }, []);

  let editorBody;
  switch(state.editingType) {
    case node.NodeType.Comment:
      editorBody = (
        <NodeEditorComment
          value={state.value as node.CommentNodeData}
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
        save={() => props.close(state.value)}
        updateEditingType={updateEditingType}
      />
      <div className="node-editor-body">
        {editorBody}
      </div>
    </div>
  );
};

export default NodeEditor;
