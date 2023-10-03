import { Component } from "solid-js";
import Modal from "../modal/Modal";
import NodeEditor from "./NodeEditor";

type NodeEditorModalProps = {
	onClose?: () => void;
};

const NodeEditorModal: Component<NodeEditorModalProps> = props => {
	return (
		<Modal onClose={props.onClose}>
			<NodeEditor onClose={props.onClose} />
		</Modal>
	);
};

export default NodeEditorModal;
