import React, { MouseEventHandler } from "react";

import "./Modal.css";

export type ModalProps = {
  fullHeight: boolean;
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
    let contentClass = "m-modal-content";
    if (props.fullHeight) {
      contentClass += " h-100";
    }
    return (
      <div className="m-modal" onClick={handleModalClick}>
        <div className={contentClass}>{props.children}</div>
      </div>
    );
  } else {
    return null;
  }
};

export default Modal;
