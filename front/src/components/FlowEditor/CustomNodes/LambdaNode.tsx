import { memo } from "react";
import { Handle, Position } from "reactflow";

import NameDisplay from "./NameDisplay";
import * as cnh from "./helper";
import * as node from "../../../common/node";

export type LambdaNodeProps = {
  data: node.LambdaNodeData;
  isConnectable: boolean;
};

const LambdaNode = (props: LambdaNodeProps) => {
  switch (props.data.lambdaType) {
    case node.LambdaNodeType.Pattern: {
      const count = 2 + props.data.argc;
      return (
        <>
          <div
            className="flow-node-container"
            style={{
              minHeight: `${cnh.minLengthKeepingDistance(1, count)}rem`,
            }}>
            <div className="flow-node-container-icon flow-node-container-icon-lg">
              λ
            </div>
            <div className="flow-node-container-body">
              <NameDisplay name={props.data.pattern} />
            </div>
          </div>
          <Handle
            id={node.HANDLE_LAMBDA_FALLBACK}
            type="target"
            position={Position.Top}
            isConnectable={props.isConnectable}
            className="flow-handle-lambda-arg"
          />
          <Handle
            id={node.HANDLE_LAMBDA_VAL}
            type="source"
            position={Position.Bottom}
            isConnectable={props.isConnectable}
            className="flow-handle-lambda-ret"
          />
          <Handle
            id={node.HANDLE_LAMBDA_ARG}
            type="source"
            position={Position.Left}
            isConnectable={props.isConnectable}
            style={{ top: cnh.positionPercentage(0, count) }}
            className="flow-handle-lambda-ret"
          />
          {[...Array(props.data.argc)].map((_, i) => (
            <Handle
              key={i}
              id={`${node.HANDLE_LAMBDA_ELEM_PREFIX}${i}`}
              type="source"
              position={Position.Left}
              isConnectable={props.isConnectable}
              style={{ top: cnh.positionPercentage(i + 1, count) }}
              className="flow-handle-lambda-ret"
            />
          ))}
          <Handle
            id={node.HANDLE_LAMBDA_RET}
            type="target"
            position={Position.Left}
            isConnectable={props.isConnectable}
            style={{ top: cnh.positionPercentage(count - 1, count) }}
            className="flow-handle-lambda-arg"
          />
        </>
      );
    }
    case node.LambdaNodeType.Any:
      return (
        <>
          <div className="flow-node-container" style={{ minHeight: `2rem` }}>
            <div className="flow-node-container-body">λ</div>
          </div>
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
            style={{ top: cnh.positionPercentage(0, 2) }}
            className="flow-handle-lambda-ret"
          />
          <Handle
            id="ret"
            type="target"
            position={Position.Left}
            isConnectable={props.isConnectable}
            style={{ top: cnh.positionPercentage(1, 2) }}
            className="flow-handle-lambda-arg"
          />
        </>
      );
  }
};

export default memo(LambdaNode);
