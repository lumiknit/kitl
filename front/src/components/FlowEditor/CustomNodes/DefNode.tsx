import { memo } from "react";
import { Handle, Position } from "reactflow";

export type DefNodeProps = {
  data: string;
  isConnectable: boolean;
};

const DefNode = (props: DefNodeProps) => {
  return (
    <>
      <div> {props.data} </div>
      <Handle
        id="ctx"
        type="source"
        position={Position.Left}
        isConnectable={props.isConnectable}
        style={{ top: "1rem" }}
      />
      <Handle
        id="arg"
        type="source"
        position={Position.Top}
        isConnectable={props.isConnectable}
        style={{ left: "1rem" }}
      />
      <Handle
        id="ret"
        type="target"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
      />
    </>
  );
};

const memoed = memo(DefNode);

export default memoed;
