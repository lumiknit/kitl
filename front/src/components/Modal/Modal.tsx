import React, { MouseEventHandler } from "react";

import "./Modal.css";

export type ModalProps = {
  open: boolean;
  onClose?: () => void;
  children?: React.ReactNode | React.ReactNode[];
};

const Modal = (props: ModalProps) => {
  const handleModalClick: MouseEventHandler<HTMLDivElement> = event => {
    if (!props.onClose) return;
    // Check only background is clicked
    if (event.target === event.currentTarget) {
      props.onClose();
    }
  };

  if (props.open) {
    return (
      <div className="m-modal" onClick={handleModalClick}>
        <div className="m-modal-content">{props.children}</div>
      </div>
    );
  } else {
    return null;
  }
};

export default Modal;
