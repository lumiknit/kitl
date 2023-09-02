import { Node } from "reactflow";

import * as node from "../../../common/node";

export const positionPercentage = (index: number, count: number) => {
  let p = 0;
  if (count < 1) {
    p = 0;
  } else if (count === 1) {
    p = 0.5;
  } else {
    p = index / (count - 1);
  }
  return `calc(0.8rem + (100% - 1.6rem) * ${p})`;
};

export const minLengthKeepingDistance = (
  dist: number,
  count: number,
): number => {
  switch (count) {
    case 0:
      return 0.5;
    case 1:
      return 1;
    default:
      return (dist * (count - 1) * 10) / 6;
  }
};

export const flowNodeToNodeData = (node: Node): node.NodeData => {
  return {
    type: node.type,
    ...node.data,
  };
};
