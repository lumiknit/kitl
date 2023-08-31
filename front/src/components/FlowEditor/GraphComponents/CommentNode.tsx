import { memo } from "react";

import { CommentNodeData } from "../../../common/node";

export type CommentNodeProps = {
  data: CommentNodeData;
};

const CommentNode = (props: CommentNodeProps) => {
  return (
    <div className="flow-node-container-comment flow-node-serif">
      {props.data.content}
    </div>
  );
};

const memoed = memo(CommentNode);

export default memoed;
