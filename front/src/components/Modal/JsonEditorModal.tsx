import * as jh from "../JsonEditor/helper";
import JsonEditor from "../JsonEditor/JsonEditor";
import Modal from "./Modal";

export type JsonEditorModalProps = {
  open: boolean;
  onClose?: () => void;
  path: string;
  valueBox: jh.Json[];
};

const JsonEditorModal = (props: JsonEditorModalProps) => {
  return (
    <Modal open={props.open} onClose={props.onClose} fullHeight={true}>
      <JsonEditor path={props.path} valueBox={props.valueBox} />
    </Modal>
  );
};

export default JsonEditorModal;
