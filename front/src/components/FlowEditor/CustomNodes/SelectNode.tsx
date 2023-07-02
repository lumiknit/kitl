import { memo } from "react";
import { Handle, Position } from "reactflow";
import BI from "../../Util/BI";

export type SelectNodeProps = {
  isConnectable: boolean;
};

const SelectNode = (props: SelectNodeProps) => {
  return (
    <>
      <BI iconName="toggles2" />
      <Handle
        id="cond"
        type="target"
        position={Position.Left}
        isConnectable={props.isConnectable}
      />
      <Handle
        id="left"
        type="target"
        position={Position.Top}
        isConnectable={props.isConnectable}
        style={{ left: "25%" }}
      />
      <Handle
        id="right"
        type="target"
        position={Position.Top}
        isConnectable={props.isConnectable}
        style={{ left: "75%" }}
      />
      <Handle
        id="ret"
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
      />
    </>
  );
};

const memoed = memo(SelectNode);

export default memoed;
