import Modal from "@/components/modal/Modal";
import { Component } from "solid-js";
import Browser from "./Browser";

type BrowserModalProps = {
	onClose: () => void;
};

const BrowserModal: Component<BrowserModalProps> = props => {
	return (
		<Modal onClose={props.onClose}>
			<Browser onClose={props.onClose} />
		</Modal>
	);
};

export default BrowserModal;
