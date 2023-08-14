import { ReactElement } from "react";
import { TbCheck } from "react-icons/tb";

export type ModalHeaderProps = {
  icon: ReactElement | ReactElement[];
  title: string;
  onClose: () => void;
};

const ModalHeader = (props: ModalHeaderProps) => {
  return (
    <div className="m-modal-header shadow">
      <div className="input-group">
        <button type="button" className="btn btn-primary">
          {props.icon}
        </button>
        <div className="form-control">{props.title}</div>
        <button
          className="btn btn-success"
          type="button"
          onClick={props.onClose}>
          <TbCheck />
        </button>
      </div>
    </div>
  );
};

export default ModalHeader;
