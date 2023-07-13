import { memo } from "react";
import { Handle, Position } from "reactflow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";

export type MemNodeProps = {
  isConnectable: boolean;
};

const MemNode = (props: MemNodeProps) => {
  return (
    <>
      <FontAwesomeIcon icon={faClipboard} />
      <Handle
        id="arg"
        type="target"
        position={Position.Top}
        isConnectable={props.isConnectable}
        className="flow-handle-mem-arg"
      />
      <Handle
        id="ret"
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
        className="flow-handle-mem-ret"
      />
    </>
  );
};

const memoed = memo(MemNode);

export default memoed;
