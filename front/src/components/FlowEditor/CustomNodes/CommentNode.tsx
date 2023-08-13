import { memo } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CommentNodeData } from "../../../common/node";

export type CommentNodeProps = {
  data: CommentNodeData;
  isConnectable: boolean;
};

const CommentNode = (props: CommentNodeProps) => {
  return (
    <>
      <ReactMarkdown
        children={props.data.content}
        remarkPlugins={[remarkGfm]}
      />
    </>
  );
};

const memoed = memo(CommentNode);

export default memoed;
