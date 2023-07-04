import Modal from "./Modal";

export type OpNodeProps = {
  open: boolean;
  onClose?: () => void;
  path: string;
  valueBox: string[];
};

const OpNodeModal = (props: OpNodeProps) => {
  const onChange =
    (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      props.valueBox[idx] = e.target.value;
    };
  return (
    <Modal open={props.open} onClose={props.onClose} fullHeight={false}>
      <h1> {props.path} </h1>
      <label className="form-label">Module</label>
      <input
        type="text"
        className="form-control py-1"
        defaultValue={props.valueBox[0]}
        onChange={onChange(0)}
      />
      <label className="form-label">OpName</label>
      <input
        type="text"
        className="form-control py-1"
        defaultValue={props.valueBox[1]}
        onChange={onChange(1)}
        autoFocus
      />
    </Modal>
  );
};

export default OpNodeModal;
