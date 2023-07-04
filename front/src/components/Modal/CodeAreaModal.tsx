import CodeArea from "../CodeArea/CodeArea";
import Modal from "./Modal";

export type CodeAreaModelProps = {
  open: boolean;
  onClose?: () => void;
  path: string;
  valueBox: string[];
};

const CodeAreaModal = (props: CodeAreaModelProps) => {
  return (
    <Modal open={props.open} onClose={props.onClose} fullHeight={false}>
      <h1> {props.path} </h1>
      <CodeArea valueBox={props.valueBox} autoFocus />
    </Modal>
  );
};

export default CodeAreaModal;
