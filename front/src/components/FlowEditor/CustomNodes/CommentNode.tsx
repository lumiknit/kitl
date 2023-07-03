import { memo } from "react";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type CommentNodeProps = {
  data: string;
  isConnectable: boolean;
};

const CommentNode = (props: CommentNodeProps) => {
  return (
    <>
      <ReactMarkdown children={props.data} remarkPlugins={[remarkGfm]} />
    </>
  );
};

const memoed = memo(CommentNode);

export default memoed;
