import { Component, JSX, Show, onMount } from "solid-js";

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
	const handleModalKeyDown: JSX.EventHandler<
		HTMLDivElement,
		KeyboardEvent
	> = e => {
		if (!props.onClose) return;
		if (e.key === "Escape") {
			props.onClose();
		}
	};
	onMount(() => {
		ref!.focus();
		setTimeout(() => {
			ref!.classList.add("show");
			ref!.addEventListener("click", handleModalClick as any);
			ref!.addEventListener("keydown", handleModalKeyDown as any);
		}, 100);
	});
	return (
		<div
			ref={ref}
			class={`m-modal ${
				ModalPositionClass[props.position ?? ModalPosition.Center]
			} ${props.transition ? "transition" : ""}`}
			tabIndex={0}>
			<div
				classList={{
					"m-modal-content": true,
					transition: props.transition,
					"h-100": props.fullHeight,
				}}>
				<Show when={props.position === ModalPosition.Bottom}>
					<div class="m-modal-handle" />
				</Show>
				{props.children}
			</div>
		</div>
	);
};

export default Modal;
