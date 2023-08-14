import CodeArea from "../Helpers/CodeArea";

import * as node from "../../common/node";
import { useCallback } from "react";
import i18n from "../../locales/i18n";

export type NodeEditorCommentProps = {
  value: node.CommentNodeData;
  onChange: (value: node.NodeData) => void;
};

const NodeEditorComment = (props: NodeEditorCommentProps) => {
  const onChange = useCallback(
    (value: string) => {
      props.onChange({
        type: node.NodeType.Comment,
        content: value,
      });
    },
    [props.onChange],
  );

  return (
    <>
      <h3>{i18n.t('nodeEditor.common.comment')}</h3>
      <CodeArea defaultValue={props.value.content} onChange={onChange} />
    </>
  );
};

export default NodeEditorComment;
