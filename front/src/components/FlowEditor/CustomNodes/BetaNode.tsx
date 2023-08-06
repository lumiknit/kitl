import { memo } from "react";
import { Handle, Position } from "reactflow";
import NameDisplay from "./NameDisplay";
import * as cnh from "./helper";

export enum BetaNodeType {
  Literal,
  App,
  Name,
}

export type BetaNodeLiteral = {
  type: BetaNodeType.Literal;
  value: any;
};

export type BetaNodeApp = {
  type: BetaNodeType.App;
  argc: number;
};

export type BetaNodeName = {
  type: BetaNodeType.Name;
  module: string;
  name: string;
  argc: number;
};

export type BetaNodeData = BetaNodeLiteral | BetaNodeApp | BetaNodeName;

export type BetaNodeProps = {
  data: BetaNodeData;
  isConnectable: boolean;
};

const BetaNode = (props: BetaNodeProps) => {
  let inner = null;
  let argc = 0;
  let take = false;
  switch (props.data.type) {
    case BetaNodeType.Literal:
      inner = <div>{props.data.value}</div>;
      break;
    case BetaNodeType.App:
      inner = <div>β</div>;
      argc = props.data.argc;
      take = true;
      break;
    case BetaNodeType.Name:
      inner = <NameDisplay name={props.data.name} module={props.data.module} />;
      argc = props.data.argc;
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
