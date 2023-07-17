import { useState } from "react";
import CodeArea from "../CodeArea/CodeArea";
import Modal from "./Modal";
import ModalHeader from "./ModalHeader";
import { faCode } from "@fortawesome/free-solid-svg-icons";

export type CodeAreaModelProps = {
  open: boolean;
  onClose?: (value: string) => void;
  path: string;
  defaultValue: string;
  onChange?: (value: string) => void;
};

const CodeAreaModal = (props: CodeAreaModelProps) => {
  const [state, setState] = useState({
    value: props.defaultValue,
  });

  const onChange = (value: string) => {
    setState({
      ...state,
      value: value,
    });
  };

  const onClose = () => {
    if (props.onClose !== undefined) {
      props.onClose(state.value);
    }
  };

  return (
    <Modal open={props.open} onClose={onClose} fullHeight={false}>
      <ModalHeader icon={faCode} title={props.path} onClose={onClose} />
      <CodeArea
        defaultValue={props.defaultValue}
        onChange={onChange}
        autoFocus
      />
    </Modal>
  );
};

export default CodeAreaModal;
