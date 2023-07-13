import { useRef } from "react";

import Modal from "./Modal";

export type OpNodeValue = {
  module: string;
  name: string;
};

export type OpNodeProps = {
  open: boolean;
  onClose?: () => void;
  path: string;
  onChange?: (value: any) => void;
  defaultValue: OpNodeValue;
};

const OpNodeModal = (props: OpNodeProps) => {
  const modRef = useRef<HTMLInputElement>(null);
  const opRef = useRef<HTMLInputElement>(null);
  const onChange = () => {
    const value = {
      module: modRef.current?.value,
      name: opRef.current?.value,
    };
    if (props.onChange) {
      props.onChange(value);
    }
  };
  return (
    <Modal open={props.open} onClose={props.onClose} fullHeight={false}>
      <h1> {props.path} </h1>
      <label className="form-label">Module</label>
      <input
        ref={modRef}
        type="text"
        className="form-control py-1"
        defaultValue={props.defaultValue.module}
        onChange={onChange}
      />
      <label className="form-label">OpName</label>
      <input
        ref={opRef}
        type="text"
        className="form-control py-1"
        defaultValue={props.defaultValue.name}
        onChange={onChange}
        autoFocus
      />
    </Modal>
  );
};

export default OpNodeModal;
