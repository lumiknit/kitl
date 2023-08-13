import { memo } from "react";
import { Handle, Position } from "reactflow";

import NameDisplay from "./NameDisplay";
import * as node from "../../../common/node";

export type DefNodeProps = {
  data: node.Name & node.DefNodeData;
  isConnectable: boolean;
};

const DefNode = (props: DefNodeProps) => {
  return (
    <>
      <div className="d-flex align-items-center">
        <NameDisplay name={props.data} />
        <span className="fs-5 m-0 ms-1">≔</span>
      </div>
      <Handle
        id={node.HANDLE_DEF_ARG}
        type="target"
        position={Position.Top}
        isConnectable={props.isConnectable}
        className="flow-handle-def-arg"
      />
    </>
  );
};

export default memo(DefNode);
