import Modal, { ModalPosition } from "@/components/modal/Modal";
import { State } from "@/hrm";
import { Component, createSignal } from "solid-js";
import RadioButtons, { RadioButton } from "@/block/RadioButtons";
import { Button, Color } from "@/block";
import InputCode from "@/block/InputCode";
import { TbRocket } from "solid-icons/tb";

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
	// Dummy launch to run js
	let taRef: HTMLTextAreaElement | undefined;
	const [result, setResult] = createSignal<any>("");
	const handleClick = () => {
		if (!taRef) return;
		const code = taRef.value;
		setResult("<Running...>");
		const f = new Function(code);
		setResult(f());
	};
	return (
		<Modal
			position={ModalPosition.Bottom}
			transition
			onClose={props.onClose}>
			<RadioButtons
				buttons={tabButtons}
				initialValue={LaunchModalTab.Launch}
			/>
			<InputCode
				ref={taRef}
				autoresize
				value=""
				placeholder="JS Code here, return will be the result"
			/>
			<Button color={Color.primary} onClick={handleClick} class="w-100">
				<TbRocket />
				Launch
			</Button>
			<pre>{result()}</pre>
		</Modal>
	);
};

export default LaunchModal;
