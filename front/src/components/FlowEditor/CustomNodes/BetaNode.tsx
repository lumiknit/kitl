import { memo } from "react";
import { Handle, Position } from "reactflow";
import NameDisplay from "./NameDisplay";
import * as cnh from "./helper";
import * as node from "../../../common/node";

export type BetaNodeProps = {
  data: node.BetaNodeData;
  isConnectable: boolean;
};

const BetaNode = (props: BetaNodeProps) => {
  let inner = null;
  const argc = props.data.argc + 1;
  let take = false;
  switch (props.data.betaType) {
    case node.BetaNodeType.App:
      {
        inner = <div>β</div>;
        take = true;
      }
      break;
    case node.BetaNodeType.Name:
      {
        const data: node.BetaNodeName = props.data;
        inner = <NameDisplay name={data.name} />;
      }
      break;
  }

  return (
    <>
      {inner}
      {[...Array(argc)].map((_, i) => (
        <Handle
          key={i}
          id={`arg${i}`}
          type="target"
          position={Position.Top}
          isConnectable={props.isConnectable}
          style={{ left: cnh.positionPercentage(i, argc) }}
          className="flow-handle-beta-arg"
        />
      ))}
      {take ? (
        <Handle
          id={`val`}
          type="target"
          position={Position.Left}
          isConnectable={props.isConnectable}
          className="flow-handle-beta-arg"
        />
      ) : null}
      <Handle
        id={`ret`}
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
        className="flow-handle-beta-ret"
      />
    </>
  );
};

export default memo(BetaNode);
