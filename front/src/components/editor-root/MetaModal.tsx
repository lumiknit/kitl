import Modal, { ModalPosition } from "@/components/modal/Modal";
import { Component } from "solid-js";
import { Button, Color } from "@/block";
import {
	State,
	openBrowserModal,
	openGraphToolsModal,
	openLaunchModal,
} from "./state";
import { TbBinaryTree, TbFolderSearch, TbRocket } from "solid-icons/tb";
import { s } from "@/locales";

export type MetaModalProps = {
	onClose: () => void;
	state: State;
};

const MetaModal: Component<MetaModalProps> = props => {
	return (
		<Modal
			position={ModalPosition.Bottom}
			transition
			onClose={props.onClose}>
			<Button
				color={Color.primary}
				class="mb-1 w-100"
				onClick={() => {
					openLaunchModal(props.state);
				}}>
				<TbRocket />
				&nbsp;
				{s("mainEditor.menu.launch")}
			</Button>
			<Button
				color={Color.info}
				class="mb-1 w-100"
				onClick={() => {
					openGraphToolsModal(props.state);
				}}>
				<TbBinaryTree />
				&nbsp;
				{s("mainEditor.menu.graphTools")}
			</Button>
			<Button
				color={Color.secondary}
				class="mb-1 w-100"
				onClick={() => {
					openBrowserModal(props.state);
				}}>
				<TbFolderSearch />
				&nbsp;
				{s("mainEditor.menu.browser")}
			</Button>
		</Modal>
	);
};

export default MetaModal;
