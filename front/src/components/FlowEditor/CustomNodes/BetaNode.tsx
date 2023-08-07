import { memo } from "react";
import { Handle, Position } from "reactflow";
import NameDisplay from "./NameDisplay";
import * as cnh from "./helper";
import * as node from "../../../common/node";

export enum BetaNodeType {
  Literal,
  App,
  Name,
}

export type BetaNodeProps = {
  data: node.BetaNodeData;
  isConnectable: boolean;
};

const BetaNode = (props: BetaNodeProps) => {
  let inner = null;
  let argc = 0;
  let take = false;
  switch (props.data.betaType) {
    case node.BetaNodeType.Literal: {
      const data: node.BetaNodeLiteral = props.data;
      inner = (
        <div>{JSON.stringify(data.value, null, 2)}</div>
      );
    } break;
    case node.BetaNodeType.App: {
      const data: node.BetaNodeApp = props.data;
      inner = (
        <div>β</div>
      );
      argc = data.argc;
      take = true;
    } break;
    case node.BetaNodeType.Name: {
      const data: node.BetaNodeName = props.data;
      inner = (
        <NameDisplay
          name={data.name.name}
          module={data.name.module}
        />
      );
      argc = data.argc;
    } break;
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
