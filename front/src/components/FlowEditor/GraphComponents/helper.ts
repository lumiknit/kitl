import { Node } from "reactflow";

import * as node from "../../../common/node";

export const positionPercentage = (index: number, count: number) => {
  if (count < 1) {
    return "0%";
  } else if (count === 1) {
    return "50%";
  } else {
    return `${20 + (60 * index) / (count - 1)}%`;
  }
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
