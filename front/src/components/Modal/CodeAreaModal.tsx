import CodeArea from "../CodeArea/CodeArea";
import Modal from "./Modal";

export type CodeAreaModelProps = {
  open: boolean;
  onClose?: () => void;
  path: string;
  defaultValue: string;
  onChange?: (value: string) => void;
};

const CodeAreaModal = (props: CodeAreaModelProps) => {
  return (
    <Modal open={props.open} onClose={props.onClose} fullHeight={false}>
      <h1> {props.path} </h1>
      <CodeArea
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        autoFocus
      />
    </Modal>
  );
};

export default CodeAreaModal;
