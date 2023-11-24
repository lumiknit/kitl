import { Component, JSX, onMount } from "solid-js";

import "./style.scss";

export enum ModalPosition {
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
	transition?: boolean;
	open?: boolean;
	onClose?: () => void;
	children: any;
};

const Modal: Component<ModalProps> = props => {
	let ref: HTMLDivElement | undefined;
	const handleModalClick: JSX.EventHandler<
		HTMLDivElement,
		MouseEvent
	> = e => {
		if (!props.onClose) return;
		if (e.target === e.currentTarget) {
			props.onClose();
		}
	};
	onMount(() => {
		setTimeout(() => {
			ref?.classList.add("show");
		}, 100);
	});
	return (
		<div
			ref={ref}
			class={`m-modal ${
				ModalPositionClass[props.position ?? ModalPosition.Center]
			} ${props.transition ? "transition" : ""}`}
			onClick={handleModalClick}>
			<div
				classList={{
					"m-modal-content": true,
					transition: props.transition,
					"h-100": props.fullHeight,
				}}>
				{props.children}
			</div>
		</div>
	);
};

export default Modal;
