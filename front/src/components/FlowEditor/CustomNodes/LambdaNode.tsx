import { memo } from "react";
import { Handle, Position } from "reactflow";

import NameDisplay from "./NameDisplay";
import * as cnh from "./helper";

export type LambdaNodeData = {
  module: string;
  name: string;
  argc: number;
};

export type LambdaNodeProps = {
  data?: LambdaNodeData;
  isConnectable: boolean;
};

const LambdaNode = (props: LambdaNodeProps) => {
  if (props.data === undefined) {
    return (
      <>
        <div style={{ minHeight: "2rem" }}>λ</div>
        <Handle
          id="val"
          type="source"
          position={Position.Bottom}
          isConnectable={props.isConnectable}
          className="flow-handle-lambda-ret"
        />
        <Handle
          id="arg"
          type="source"
          position={Position.Left}
          isConnectable={props.isConnectable}
          style={{ top: `33%` }}
          className="flow-handle-lambda-ret"
        />
        <Handle
          id="ret"
          type="target"
          position={Position.Left}
          isConnectable={props.isConnectable}
          style={{ top: `66%` }}
          className="flow-handle-lambda-arg"
        />
      </>
    );
  }
  const count = 2 + props.data.argc;
  return (
    <>
      <div
        className="d-flex align-items-center"
        style={{ minHeight: `${count}rem` }}>
        <span className="fs-5 m-0 me-1">λ</span>
        <NameDisplay name={props.data.name} module={props.data.module} />
      </div>
      <Handle
        id="fallback"
        type="target"
        position={Position.Top}
        isConnectable={props.isConnectable}
        className="flow-handle-lambda-arg"
      />
      <Handle
        id="val"
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
        className="flow-handle-lambda-ret"
      />
      <Handle
        id="arg"
        type="source"
        position={Position.Left}
        isConnectable={props.isConnectable}
        style={{ top: cnh.positionPercentage(0, count) }}
        className="flow-handle-lambda-ret"
      />
      {[...Array(props.data.argc)].map((_, i) => (
        <Handle
          key={i}
          id={`elem-${i}`}
          type="source"
          position={Position.Left}
          isConnectable={props.isConnectable}
          style={{ top: cnh.positionPercentage(i + 1, count) }}
          className="flow-handle-lambda-ret"
        />
      ))}
      <Handle
        id="ret"
        type="target"
        position={Position.Left}
        isConnectable={props.isConnectable}
        style={{ top: cnh.positionPercentage(count - 1, count) }}
        className="flow-handle-lambda-arg"
      />
    </>
  );
};

export default memo(LambdaNode);
