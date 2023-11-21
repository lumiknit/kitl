import { Component, JSX } from "solid-js";

import "./style.scss";

enum ModalPosition {
	Center,
	Bottom,
}

const ModalPositionClass = {
	[ModalPosition.Center]: "m-modal-center",
	[ModalPosition.Bottom]: "m-modal-bottom",
};

type ModalProps = {
	position?: ModalPosition;
	fullHeight?: boolean;
	open?: boolean;
	onClose?: () => void;
	children: any;
};

const Modal: Component<ModalProps> = props => {
	const handleModalClick: JSX.EventHandler<
		HTMLDivElement,
		MouseEvent
	> = e => {
		if (!props.onClose) return;
		if (e.target === e.currentTarget) {
			props.onClose();
		}
	};
	return (
		<div
			class={`m-modal ${
				ModalPositionClass[props.position ?? ModalPosition.Center]
			}`}
			onClick={handleModalClick}>
			<div
				classList={{
					"m-modal-content": true,
					"h-100": props.fullHeight,
				}}>
				{props.children}
			</div>
		</div>
	);
};

export default Modal;
