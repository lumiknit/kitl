import CodeArea from "../CodeArea/CodeArea";

import * as node from "../../common/node";
import { useCallback } from "react";

export type NodeEditorCommentProps = {
  value: node.CommentNodeData;
  updateValue: (value: node.NodeData) => void;
};

const NodeEditorComment = (props: NodeEditorCommentProps) => {
  const onChange = useCallback((value: string) => {
    props.updateValue({
      ...props.value,
      content: value,
    });
  }, [props.updateValue]);

  return (
    <CodeArea
      defaultValue={props.value.content}
      onChange={onChange}
    />
  );
};

export default NodeEditorComment;