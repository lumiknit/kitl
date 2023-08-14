import { memo } from "react";

import { CommentNodeData } from "../../../common/node";

export type CommentNodeProps = {
  data: CommentNodeData;
};

const CommentNode = (props: CommentNodeProps) => {
  return <pre>{props.data.content}</pre>;
};

const memoed = memo(CommentNode);

export default memoed;
