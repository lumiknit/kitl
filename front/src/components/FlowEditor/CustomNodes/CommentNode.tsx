import { memo } from "react";

export type CommentNodeProps = {
  data: string;
  isConnectable: boolean;
};

const CommentNode = (props: CommentNodeProps) => {
  return (
    <>
      <div> {props.data} </div>
    </>
  );
};

const memoed = memo(CommentNode);

export default memoed;
