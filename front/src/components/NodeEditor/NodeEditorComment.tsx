import CodeArea from "../Helpers/CodeArea";

import * as node from "../../common/node";
import { useCallback } from "react";

export type NodeEditorCommentProps = {
  value: node.CommentNodeData;
  updateValue: (value: node.NodeData) => void;
};

const NodeEditorComment = (props: NodeEditorCommentProps) => {
  const onChange = useCallback(
    (value: string) => {
      props.updateValue({
        type: node.NodeType.Comment,
        content: value,
      });
    },
    [props.updateValue],
  );

  return (
    <>
      <h3>Comment</h3>
      <CodeArea defaultValue={props.value.content} onChange={onChange} />
    </>
  );
};

export default NodeEditorComment;
