import { faCodeFork } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import { Handle, Position } from "reactflow";

export type SelectNodeProps = {
  isConnectable: boolean;
};

const SelectNode = (props: SelectNodeProps) => {
  return (
    <>
      <FontAwesomeIcon icon={faCodeFork} />
      <Handle
        id="cond"
        type="target"
        position={Position.Left}
        isConnectable={props.isConnectable}
        className="flow-handle-select-ctx"
      />
      <Handle
        id="left"
        type="target"
        position={Position.Top}
        isConnectable={props.isConnectable}
        style={{ left: "25%" }}
        className="flow-handle-select-arg"
      />
      <Handle
        id="right"
        type="target"
        position={Position.Top}
        isConnectable={props.isConnectable}
        style={{ left: "75%" }}
        className="flow-handle-select-arg"
      />
      <Handle
        id="ret"
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
        className="flow-handle-select-ret"
      />
    </>
  );
};

const memoed = memo(SelectNode);

export default memoed;
