import Modal from "@/components/modal/Modal";
import { Component } from "solid-js";
import Browser from "./Browser";

export type BrowserModalProps = {
	onClose: () => void;
	initialPath: string;
	editValueDef: (path: string, name: string) => Promise<void>;
};

const BrowserModal: Component<BrowserModalProps> = props => {
	return (
		<Modal onClose={props.onClose}>
			<Browser
				onClose={props.onClose}
				editValueDef={props.editValueDef}
			/>
		</Modal>
	);
};

export default BrowserModal;
