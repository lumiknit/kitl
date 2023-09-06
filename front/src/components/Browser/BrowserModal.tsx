import Browser from "./Browser";
import Modal from "../Modal/Modal";

export type BrowserModelProps = {
  open: boolean;
  onClose?: (value: string) => void;
  path: string;
  defaultValue: string;
  onChange?: (value: string) => void;
};

const BrowserModal = (props: BrowserModelProps) => {
  const onClose = () => {
    if (props.onClose !== undefined) {
      props.onClose("");
    }
  };

  return (
    <Modal open={props.open} onClose={onClose} fullHeight={true}>
      <Browser
        onClose={onClose}
      />
    </Modal>
  );
};

export default BrowserModal;
