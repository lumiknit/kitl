import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faCheck } from "@fortawesome/free-solid-svg-icons";

export type ModalHeaderProps = {
  icon: IconDefinition;
  title: string;
  onClose: () => void;
};

const ModalHeader = (props: ModalHeaderProps) => {
  return (
    <div className="m-modal-header shadow">
      <div className="input-group">
        <button type="button" className="btn btn-primary">
          <FontAwesomeIcon icon={props.icon} />
        </button>
        <div className="form-control">{props.title}</div>
        <button
          className="btn btn-success"
          type="button"
          onClick={props.onClose}>
          <FontAwesomeIcon icon={faCheck} />
        </button>
      </div>
    </div>
  );
};

export default ModalHeader;
