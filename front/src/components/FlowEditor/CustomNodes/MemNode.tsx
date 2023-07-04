import { memo } from "react";
import { Handle, Position } from "reactflow";
import BI from "../../Util/BI";

export type MemNodeProps = {
  isConnectable: boolean;
};

const MemNode = (props: MemNodeProps) => {
  return (
    <>
      <BI iconName="clipboard" />
      <Handle
        id="arg"
        type="target"
        position={Position.Top}
        isConnectable={props.isConnectable}
        className="flow-handle-arg"
      />
      <Handle
        id="ret"
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
        className="flow-handle-ret"
      />
    </>
  );
};

const memoed = memo(MemNode);

export default memoed;
