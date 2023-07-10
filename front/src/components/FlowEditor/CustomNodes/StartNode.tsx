import { memo } from "react";
import { Handle, Position } from "reactflow";

export type StartNodeProps = {
  data: string;
  isConnectable: boolean;
};

const StartNode = (props: StartNodeProps) => {
  return (
    <>
      <div style={{ bottom: 0 }}> <b>Fn</b> {props.data} </div>
      <Handle
        id="ctx"
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
        style={{ left: "1rem" }}
        className="flow-handle-def-fn"
      />
      <Handle
        id="arg"
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
        style={{ left: "3rem" }}
        className="flow-handle-def-ret"
      />
    </>
  );
};

const memoed = memo(StartNode);

export default memoed;
