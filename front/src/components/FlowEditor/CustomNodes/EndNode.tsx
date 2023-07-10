import { memo } from "react";
import { Handle, Position } from "reactflow";

export type EndNodeProps = {
  data: string;
  isConnectable: boolean;
};

const EndNode = (props: EndNodeProps) => {
  return (
    <>
      <div style={{ bottom: 0 }}> <b>Ret</b> {props.data} </div>
      <Handle
        id="arg"
        type="target"
        position={Position.Top}
        isConnectable={props.isConnectable}
        style={{ left: "1rem" }}
        className="flow-handle-def-arg"
      />
    </>
  );
};

const memoed = memo(EndNode);

export default memoed;
