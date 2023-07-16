import React from "react";

import * as jh from "../JsonEditor/helper";
import JsonEditor from "../JsonEditor/JsonEditor";
import Modal from "./Modal";

export type JsonEditorModalProps = {
  open: boolean;
  onClose?: (value: jh.Json) => void;
  defaultValue: jh.Json;
  onChange?: (value: jh.Json) => void;
  path: string;
};

const JsonEditorModal = (props: JsonEditorModalProps) => {
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
      <JsonEditor
        closeBtnRef={closeBtnRef}
        path={props.path}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        close={props.onClose}
      />
    </Modal>
  );
};

export default JsonEditorModal;
