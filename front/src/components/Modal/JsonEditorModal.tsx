import * as jh from "../JsonEditor/helper";
import JsonEditor from "../JsonEditor/JsonEditor";
import Modal from "./Modal";

export type JsonEditorModalProps = {
  open: boolean;
  onClose?: () => void;
  defaultValue: jh.Json;
  onChange?: (value: jh.Json) => void;
  path: string;
};

const JsonEditorModal = (props: JsonEditorModalProps) => {
  return (
    <Modal open={props.open} onClose={props.onClose} fullHeight={true}>
      <JsonEditor
        path={props.path}
        defaultValue={props.defaultValue}
        onChange={props.onChange}
      />
    </Modal>
  );
};

export default JsonEditorModal;
