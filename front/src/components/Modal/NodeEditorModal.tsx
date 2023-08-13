import { useCallback, useState } from "react";

import * as node from "../../common/node";

import NodeEditor from "../NodeEditor/NodeEditor";
import Modal from "./Modal";

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
  const handleChange = useCallback(
    (value: node.NodeData) => {
      setState(oldState => ({
        ...oldState,
        value: value,
      }));
    },
    [setState],
  );
  const close = useCallback(() => {
    setState(state => {
      props.onChange?.(state.value);
      props.onClose?.(state.value);
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
      />
    </Modal>
  );
};

export default NodeEditorModal;
