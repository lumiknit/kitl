import { memo } from "react";
import { Handle, Position } from "reactflow";
import NameDisplay from "./NameDisplay";
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
        inner = <>&nbsp;</>;
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
      <div className="flow-node-beta-container">
        {inner}
        {argc > 0 ? <>&nbsp;</> : null}
        {[...Array(argc)].map((_, i) => (
          <span className="flow-node-span-arg">
            {i}
            <Handle
              key={i}
              id={`${node.HANDLE_BETA_ARG_PREFIX}${i}`}
              type="target"
              position={Position.Top}
              className="flow-handle-beta-arg"
            />
          </span>
        ))}
      </div>

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
        className="flow-handle-ret flow-handle-border-color-beta"
      />
    </>
  );
};

export default memo(BetaNode);
