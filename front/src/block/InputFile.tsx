import { Component, JSX, Ref } from "solid-js";
import Button from "./Button";
import InputGroup from "./InputGroup";
import InputText from "./InputText";
import { Color } from "./colors";

type Props = {
	class?: string;
	ref?: Ref<HTMLInputElement>;
	placeholder?: string;

	onFiles?: (files: FileList) => void;
};

const InputFile: Component<Props> = props => {
	let textRef;
	let fileRef: HTMLInputElement | undefined;
	const hackRef = (ref: HTMLInputElement) => {
		fileRef = ref;
		if (typeof props.ref === "function") props.ref(ref);
	};
	const handleChange: JSX.ChangeEventHandler<HTMLInputElement, Event> = e => {
		if (props.onFiles) props.onFiles(e.target.files!);
		textRef!.value = fileRef!.value;
	};
	const handleDrop: JSX.EventHandlerUnion<HTMLDivElement, DragEvent> = e => {
		e.preventDefault();
		e.stopPropagation();
		if (props.onFiles) props.onFiles(e.dataTransfer!.files);
	};
	return (
		<InputGroup class={props.class} onDrop={handleDrop}>
			<InputText
				class={`flex-1`}
				ref={textRef}
				placeholder={props.placeholder}
				onClick={() => {
					fileRef?.click();
				}}
			/>
			<input
				ref={hackRef}
				type="file"
				class="d-none"
				onChange={handleChange}
			/>
			<Button
				color={Color.primary}
				onClick={() => {
					fileRef?.click();
				}}>
				...
			</Button>
		</InputGroup>
	);
};

export default InputFile;
