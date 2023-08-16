import { NodeData } from "../../common/node";

export type Callbacks = {
  value?: NodeData;
  onChange?: (value: NodeData) => void;
  close?: () => void;
  discard?: () => void;
};
