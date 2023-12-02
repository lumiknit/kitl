import Modal, { ModalPosition } from "@/components/modal/Modal";
import { Component } from "solid-js";
import Browser from "./Browser";

export type BrowserModalProps = {
	onClose: () => void;
	initialPath: string;
	editValueDef: (path: string, name: string) => Promise<void>;
};

const BrowserModal: Component<BrowserModalProps> = props => {
	return (
		<Modal
			onClose={props.onClose}
			transition
			position={ModalPosition.Bottom}>
			<Browser
				initialPath={props.initialPath}
				onClose={props.onClose}
				editValueDef={props.editValueDef}
			/>
		</Modal>
	);
};

export default BrowserModal;
