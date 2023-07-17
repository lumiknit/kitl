import { useRef } from "react";

import * as h from "../helper";
import Modal from "./Modal";
import MobileKeyboard from "../MobileKeyboard/MobileKeyboard";

export type OpNodeValue = {
  module: string;
  name: string;
};

export type OpNodeProps = {
  open: boolean;
  onClose?: (value: OpNodeValue) => void;
  path: string;
  defaultValue: OpNodeValue;
};

const OpNodeModal = (props: OpNodeProps) => {
  const modRef = useRef<HTMLInputElement>(null);
  const opRef = useRef<HTMLInputElement>(null);

  const onClose = () => {
    if (props.onClose !== undefined) {
      props.onClose({
        module: modRef.current?.value || "",
        name: opRef.current?.value || "",
      });
    }
  };

  const mkInsert = (value: string) => {
    const input = opRef.current;
    if (input !== null) {
      const s = input.selectionStart || 0;
      const e = input.selectionEnd || 0;
      const v = input.value;
      input.value = v.slice(0, s) + value + v.slice(e);
      input.selectionStart = s + value.length;
      input.selectionEnd = s + value.length;
    }
  };
  return (
    <Modal open={props.open} onClose={onClose} fullHeight={false}>
      <h1> {props.path} </h1>
      <label className="form-label">Module</label>
      <input
        ref={modRef}
        type="text"
        className="form-control py-1"
        defaultValue={props.defaultValue.module}
      />
      <label className="form-label">OpName</label>
      <input
        ref={opRef}
        type="text"
        className="form-control py-1"
        defaultValue={props.defaultValue.name}
        autoFocus
      />
      {h.isMobile() ? <MobileKeyboard insert={mkInsert} /> : null}
    </Modal>
  );
};

export default OpNodeModal;
