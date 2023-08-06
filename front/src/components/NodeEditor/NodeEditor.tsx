import * as node from "../../common/node";

import NodeEditorHeader from "./NodeEditorHeader";

import "./NodeEditor.css";
import { useState } from "react";

export type NodeEditorProps = {
  closeBtnRef: React.RefObject<HTMLButtonElement>;
  path: string;
  defaultValue: node.NodeData;
  onChange: (value: node.NodeData) => void;
  close: (value: node.NodeData) => void;
};

export type NodeEditorState = {
  value: node.NodeData;
};

export const NodeEditor = (props: NodeEditorProps) => {
  const [state, setState] = useState<NodeEditorState>({
    value: props.defaultValue,
  });

  const updateType = (ty: node.NodeType) => {
    let empty: node.NodeData;
    switch (ty) {
      case node.NodeType.Comment:
        empty = node.emptyCommentNode();
        break;
      case node.NodeType.Lambda:
        empty = node.emptyLambdaNode();
        break;
      default:
        empty = node.emptyBetaNode();
    }
    setState(oldState => ({
      ...oldState,
      value: empty,
    }));
  };

  return (
    <div className="node-editor">
      <NodeEditorHeader
        closeBtnRef={props.closeBtnRef}
        path={props.path}
        value={state.value}
        discard={() => props.close(props.defaultValue)}
        save={() => props.close(state.value)}
      />
    </div>
  );
};

export default NodeEditor;
