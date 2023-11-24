import Modal, { ModalPosition } from "@/components/modal/Modal";
import { Component } from "solid-js";
import InputCode from "@/block/InputCode";
import { Button, Color } from "@/block";
import { s } from "@/locales";

export type NodeEditModalProps = {
	id: string;
	initValue: string;
	onClose: () => void;
	onApply: (value: string) => void;
};

const NodeEditModal: Component<NodeEditModalProps> = props => {
	let taRef: HTMLTextAreaElement | undefined;

	return (
		<Modal
			position={ModalPosition.Bottom}
			transition
			onClose={props.onClose}>
			<Button
				color={Color.primary}
				class="w-100"
				onClick={() => props.onApply(taRef!.value)}>
				{s("menu.apply")}
			</Button>
			<InputCode ref={taRef} value={props.initValue} autoresize />
		</Modal>
	);
};

export default NodeEditModal;
