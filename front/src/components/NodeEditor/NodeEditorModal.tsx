import { useCallback, useState } from "react";

import * as node from "../../common/node";

import NodeEditor from "./NodeEditor";
import Modal from "../Modal/Modal";
import toast from "react-hot-toast";
import i18n from "../../locales/i18n";

export type NodeEditorModalProps = {
  open: boolean;
  onClose?: (value: node.NodeData) => void;
  defaultValue: node.NodeData;
  onChange?: (value: node.NodeData) => void;
  path: string;
};

type NodeEditorModalState = {
  value: node.NodeData;
};

const NodeEditorModal = (props: NodeEditorModalProps) => {
  const [, setState] = useState<NodeEditorModalState>({
    value: props.defaultValue,
  });
  const handleChange = (value: node.NodeData) => {
    setState(oldState => ({
      ...oldState,
      value: value,
    }));
  };
  const close = useCallback(() => {
    setState(state => {
      props.onChange?.(state.value);
      props.onClose?.(state.value);
      toast.success(i18n.t("nodeEditor.toast.saved"));
      return state;
    });
  }, [props, setState]);
  const discard = useCallback(() => {
    setState(state => {
      props.onClose?.(props.defaultValue);
      toast(i18n.t("nodeEditor.toast.discarded"));
      return state;
    });
  }, [props, setState]);
  return (
    <Modal open={props.open} onClose={close}>
      <NodeEditor
        path={props.path}
        defaultValue={props.defaultValue}
        onChange={handleChange}
        close={close}
        discard={discard}
      />
    </Modal>
  );
};

export default NodeEditorModal;
