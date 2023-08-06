import React from "react";

import * as node from "../../common/node"

import NodeEditor from "../NodeEditor/NodeEditor";
import Modal from "./Modal";

export type NodeEditorModalProps = {
  open: boolean;
  onClose?: (value: node.NodeData) => void;
  defaultValue: node.NodeData;
  onChange?: (value: node.NodeData) => void;
  path: string;
};

const NodeEditorModal = (props: NodeEditorModalProps) => {
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);
  return (
    <Modal
      open={props.open}
      onClose={() => {
        const btn = closeBtnRef.current;
        if (btn !== null) {
          btn.click();
        }
      }}
      fullHeight={true}>
      <NodeEditor
        closeBtnRef={closeBtnRef}
        path={props.path}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        close={props.onClose}
      />
    </Modal>
  );
};

export default NodeEditorModal;
