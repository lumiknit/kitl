import * as fc from "../FlowEditor/context";

export type KitlContext = {
  // FlowEditor context
  path: string;
  name: string;

  flowContext: fc.FlowContext;
};

export const newKitlContext = (path: string) => {
  console.warn("value parsing is not implemented");
  return {
    path,
    name: path,
    flowContext: fc.useEmptyFlowContext(path, path),
  };
};
