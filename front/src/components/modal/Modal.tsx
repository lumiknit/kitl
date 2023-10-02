import { Component, JSX } from "solid-js";

import "./style.scss";

type ModalProps = {
	fullHeight?: boolean;
	open?: boolean;
	onClose?: () => void;
	children: any;
};

const Modal: Component<ModalProps> = (props) => {
	const handleModalClick: JSX.EventHandler<HTMLDivElement, MouseEvent> = e => {
		if(!props.onClose) return;
		if(e.target === e.currentTarget) {
			props.onClose();
		}
	};
	return (
		<div class="m-modal" onClick={handleModalClick}>
			<div classList={{
				"m-modal-content": true,
				"m-modal-content-stick-to-center": true,
				"h-100": props.fullHeight,
			}}>
				{props.children}
			</div>
			
		</div>
	);
};

export default Modal;