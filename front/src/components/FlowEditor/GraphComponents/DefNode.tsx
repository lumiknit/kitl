import { memo } from "react";
import { Handle, Position } from "reactflow";

import NameDisplay from "./NameDisplay";
import * as node from "../../../common/node";

export type DefNodeProps = {
  data: node.Name & node.DefNodeData;
};

const DefNode = (props: DefNodeProps) => {
  return (
    <>
      <div className="flow-node-container">
        <div className="flow-node-container-icon flow-node-container-icon-lg">
          ≕
        </div>
        <div className="flow-node-container-body">
          <NameDisplay name={props.data} />
        </div>
      </div>
      <Handle
        id={node.HANDLE_DEF_ARG}
        type="target"
        position={Position.Top}
        className="flow-handle-def-arg"
      />
    </>
  );
};

export default memo(DefNode);
