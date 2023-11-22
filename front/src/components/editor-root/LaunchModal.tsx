import Modal, { ModalPosition } from "@/components/modal/Modal";
import { State } from "@/hrm";
import { Component } from "solid-js";
import { ModalType } from "./Modals";
import RadioButtons, { RadioButton } from "@/block/RadioButtons";
import { Color } from "@/block";

enum LaunchModalTab {
	Launch,
	History,
}

const tabButtons: RadioButton<LaunchModalTab>[] = [
	{
		color: Color.primary,
		label: "Launch",
		value: LaunchModalTab.Launch,
	},
	{
		color: Color.info,
		label: "History",
		value: LaunchModalTab.History,
	},
];

export type LaunchModalProps = {
	onClose: () => void;
	state: State;
};

const LaunchModal: Component<LaunchModalProps> = props => {
	return (
		<Modal position={ModalPosition.Bottom} onClose={props.onClose}>
			<RadioButtons
				buttons={tabButtons}
				initialValue={LaunchModalTab.Launch}
			/>
			Hello
		</Modal>
	);
};

export default LaunchModal;
