import { memo } from "react";
import { Handle, Position } from "reactflow";

export type DefNodeProps = {
  data: string;
  isConnectable: boolean;
};

const DefNode = (props: DefNodeProps) => {
  return (
    <>
      <div style={{ bottom: 0 }}> {props.data} </div>
      <Handle
        id="ctx"
        type="source"
        position={Position.Right}
        isConnectable={props.isConnectable}
        style={{ top: "90%" }}
        className="flow-handle-ctx"
      />
      <Handle
        id="arg"
        type="source"
        position={Position.Right}
        isConnectable={props.isConnectable}
        style={{ top: "0%" }}
        className="flow-handle-arg"
      />
      <Handle
        id="ret"
        type="target"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
        className="flow-handle-ret"
      />
    </>
  );
};

const memoed = memo(DefNode);

export default memoed;
