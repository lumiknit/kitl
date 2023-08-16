import { useState } from "react";

import * as node from "../../common/node";

import NodeEditor from "./NodeEditor";
import Modal from "../Modal/Modal";
import toast from "react-hot-toast";
import i18n from "../../locales/i18n";
import { Callbacks } from "./types";

export type NodeEditorModalProps = {
  open: boolean;
  onClose?: (value: node.NodeData) => void;
  defaultValue: node.NodeData;
  onChange?: (value: node.NodeData) => void;
  path: string;
};

export type NodeEditorModalCallbacks = {
  close?: () => void;
  discard?: () => void;
};

const NodeEditorModal = (props: NodeEditorModalProps) => {
  const [callbacks] = useState<Callbacks>({});
  callbacks.onChange = (value: node.NodeData) => {
    callbacks.value = value;
  };
  callbacks.close = () => {
    if(callbacks.value === undefined) {
      callbacks.value = props.defaultValue;
    }
    props.onChange?.(callbacks.value);
    props.onClose?.(callbacks.value);
    toast.success(i18n.t("nodeEditor.toast.saved"));
  };
  callbacks.discard =() => {
    props.onClose?.(props.defaultValue);
    toast(i18n.t("nodeEditor.toast.discarded"));
  };
  return (
    <Modal open={props.open} onClose={close}>
      <NodeEditor
        path={props.path}
        defaultValue={props.defaultValue}
        callbacks={callbacks}
      />
    </Modal>
  );
};

export default NodeEditorModal;
