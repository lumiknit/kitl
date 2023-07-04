import * as jh from "../JsonEditor/helper";
import CodeArea from "../CodeArea/CodeArea";
import Modal from "./Modal";

export type JsonEditorModalProps = {
  open: boolean;
  onClose?: () => void;
  path: string;
  valueBox: string[];
};

const CodeAreaModal = (props: JsonEditorModalProps) => {
  return (
    <Modal open={props.open} onClose={props.onClose} fullHeight={true}>
      <h1> {props.path} </h1>
      <CodeArea valueBox={props.valueBox} />
    </Modal>
  );
};

export default CodeAreaModal;
