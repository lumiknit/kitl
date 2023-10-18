import { Button, Color, InputGroup, InputText } from "@/block";
import InputLabel from "@/block/InputLabel";
import Modal from "@/components/modal/Modal";
import { s } from "@/locales";
import { TbFolderSearch, TbX } from "solid-icons/tb";
import { Component } from "solid-js";

type BrowserModalProps = {
	onClose: () => void;
};

const BrowserModal: Component<BrowserModalProps> = props => {
	return (
		<Modal onClose={props.onClose}>
			{/* Header */}
			<InputGroup>
				<InputLabel color={Color.primary}>
					<TbFolderSearch />
				</InputLabel>
				<InputText class="flex-1" disabled={true} value="Browser Tools" />
				<Button color={Color.danger} onClick={props.onClose}>
					<TbX />
				</Button>
			</InputGroup>
			{/* Body */}
			Hello
		</Modal>
	);
};

export default BrowserModal;
