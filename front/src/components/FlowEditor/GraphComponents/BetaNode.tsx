import { memo } from "react";
import { Handle, Position } from "reactflow";
import NameDisplay from "./NameDisplay";
import * as cnh from "./helper";
import * as node from "../../../common/node";

export type BetaNodeProps = {
  data: node.BetaNodeData;
};

const BetaNode = (props: BetaNodeProps) => {
  let inner = null;
  const argc = props.data.argc;
  let take = false;
  switch (props.data.betaType) {
    case node.BetaNodeType.App:
      {
        inner = <div className="flow-node-dimmed">β</div>;
        take = true;
      }
      break;
    case node.BetaNodeType.Name:
      {
        const data: node.BetaNameNodeData = props.data;
        inner = <NameDisplay name={data.name} />;
      }
      break;
  }

  return (
    <>
      <div
        style={{
          minWidth: `${cnh.minLengthKeepingDistance(1, argc)}rem`,
          paddingLeft: `${argc * 0.01}px`,
        }}
      >
        {inner}
      </div>
      {[...Array(argc)].map((_, i) => (
        <Handle
          key={i}
          id={`${node.HANDLE_BETA_ARG_PREFIX}${i}`}
          type="target"
          position={Position.Top}
          style={{ left: cnh.positionPercentage(i, argc) }}
          className="flow-handle-beta-arg"
        />
      ))}
      {take ? (
        <Handle
          id={node.HANDLE_BETA_FUN}
          type="target"
          position={Position.Left}
          className="flow-handle-beta-arg"
        />
      ) : null}
      <Handle
        id={`${node.HANDLE_BETA_ARG_PREFIX}${argc}`}
        type="target"
        position={Position.Top}
        style={{ left: "100%" }}
        className="flow-handle-hidden"
      />
      <Handle
        id={node.HANDLE_BETA_RET}
        type="source"
        position={Position.Bottom}
        className="flow-handle-beta-ret"
      />
    </>
  );
};

export default memo(BetaNode);
