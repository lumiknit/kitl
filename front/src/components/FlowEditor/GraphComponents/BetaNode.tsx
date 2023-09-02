import { memo } from "react";
import { Handle, Position } from "reactflow";
import NameDisplay from "./NameDisplay";
import * as node from "../../../common/node";

import * as cnh from "./helper";

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
      <div
        style={{
          minWidth: `${0.6 + cnh.minLengthKeepingDistance(0.8, argc)}rem`,
          paddingLeft: `${0.01 * argc}rem`, // For force rerendering
        }}>
        {inner}
        {[...Array(argc)].map((_, i) => (
          <Handle
            key={i}
            id={`${node.HANDLE_BETA_ARG_PREFIX}${i}`}
            type="target"
            position={Position.Top}
            style={{ left: cnh.positionPercentage(i, argc) }}
            className="flow-handle-beta-in"
          />
        ))}
      </div>

      {take ? (
        <Handle
          id={node.HANDLE_BETA_FUN}
          type="target"
          position={Position.Left}
          className="flow-handle-beta-in"
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
        id={node.HANDLE_VAL}
        type="source"
        position={Position.Bottom}
        className="flow-handle-val flow-handle-border-color-beta"
      />
    </>
  );
};

export default memo(BetaNode);
