import { memo } from "react";
import { Handle, Position } from "reactflow";

import NameDisplay from "./NameDisplay";
import * as cnh from "./helper";
import * as node from "../../../common/node";

export type LambdaNodeProps = {
  data: node.LambdaNodeData;
};

const LambdaNode = (props: LambdaNodeProps) => {
  const isPattern = props.data.lambdaType === node.LambdaNodeType.Pattern;
  let argc = 0;
  let inner: any = null;
  if (isPattern) {
    argc = (props.data as node.LambdaPatternNodeData).argc;
    const pattern = (props.data as node.LambdaPatternNodeData).pattern;
    inner = (
      <>
        <div className="flow-node-container-icon flow-node-container-icon-lg">
          λ
        </div>
        <div className="flow-node-container-body">
          <NameDisplay name={pattern} />
        </div>
      </>
    );
  } else {
    inner = <div className="flow-node-container-body flow-node-dimmed">λ</div>;
  }
  const count = 2 + argc;
  return (
    <>
      <div
        className="flow-node-container"
        style={{
          minHeight: `${cnh.minLengthKeepingDistance(1, count)}rem`,
        }}>
        {inner}
      </div>
      <Handle
        id={node.HANDLE_LAMBDA_RET}
        type="source"
        position={Position.Bottom}
        className="flow-handle-ret flow-handle-border-color-lambda"
      />
      <Handle
        id="ret"
        type="target"
        position={Position.Left}
        style={{ top: cnh.positionPercentage(count - 1, count) }}
        className="flow-handle-lambda-arg"
      />
      <Handle
        id={node.HANDLE_LAMBDA_BODY_ARG}
        type="source"
        position={Position.Left}
        style={{ top: cnh.positionPercentage(0, count) }}
        className="flow-handle-lambda-ret"
      />
      {props.data.lambdaType !== node.LambdaNodeType.Pattern ? null : (
        <Handle
          id={node.HANDLE_LAMBDA_ARG}
          type="target"
          position={Position.Top}
          className="flow-handle-lambda-arg"
        />
      )}
      {[...Array(argc)].map((_, i) => (
        <Handle
          key={i}
          id={`${node.HANDLE_LAMBDA_ELEM_PREFIX}${i}`}
          type="source"
          position={Position.Left}
          style={{ top: cnh.positionPercentage(i + 1, count) }}
          className="flow-handle-lambda-ret"
        />
      ))}
    </>
  );
};

export default memo(LambdaNode);
