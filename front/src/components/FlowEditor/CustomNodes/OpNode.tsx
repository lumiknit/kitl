<<<<<<< HEAD
import { memo } from "react";
import { Handle, Position } from "reactflow";

import opNameSymbol from "./opsym";

export type Op = {
  module: string;
  name: string;
};

type OpNodeProps = {
  data: Op;
  isConnectable: boolean;
};

const OpNode = (props: OpNodeProps) => {
  return (
    <>
      <Handle
        id="ctx"
        type="target"
        position={Position.Left}
        onConnect={params => console.log("handle onConnect", params)}
        isConnectable={props.isConnectable}
        className="flow-handle-op-ctx"
      />
      <Handle
        id="arg"
        type="target"
        position={Position.Top}
        onConnect={params => console.log("handle onConnect", params)}
        isConnectable={props.isConnectable}
        className="flow-handle-op-arg"
      />
      {props.data.module !== "" ? (
        <div className="flow-node-op-module">{props.data.module}:</div>
      ) : (
        ""
      )}
      <div className="flow-node-op-name">
        {opNameSymbol[props.data.name] !== undefined
          ? opNameSymbol[props.data.name]
          : props.data.name}
      </div>
      <Handle
        id="clo"
        type="source"
        position={Position.Right}
        isConnectable={props.isConnectable}
        className="flow-handle-op-fn"
      />
      <Handle
        id="ret"
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
        className="flow-handle-op-ret"
      />
    </>
  );
};

const memoed = memo(OpNode);

export default memoed;
||||||| 3ee2a90
=======
import { memo } from "react";
import { Handle, Position } from "reactflow";

import opNameSymbol from "./opsym";

export type Op = {
  module: string;
  name: string;
};

type OpNodeProps = {
  data: Op;
  isConnectable: boolean;
};

const OpNode = (props: OpNodeProps) => {
  return (
    <>
      <Handle
        id="ctx"
        type="target"
        position={Position.Left}
        onConnect={params => console.log("handle onConnect", params)}
        isConnectable={props.isConnectable}
        className="flow-handle-ctx"
      />
      <Handle
        id="arg"
        type="target"
        position={Position.Top}
        onConnect={params => console.log("handle onConnect", params)}
        isConnectable={props.isConnectable}
        className="flow-handle-arg"
      />
      {props.data.module !== "" ? (
        <div className="flow-node-op-module">{props.data.module}:</div>
      ) : (
        ""
      )}
      <div className="flow-node-op-name">
        {opNameSymbol[props.data.name] !== undefined
          ? opNameSymbol[props.data.name]
          : props.data.name}
      </div>
      <Handle
        id="clo"
        type="source"
        position={Position.Right}
        isConnectable={props.isConnectable}
        className="flow-handle-fn"
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

const memoed = memo(OpNode);

export default memoed;
>>>>>>> main
