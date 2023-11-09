import { Component, JSX, Ref } from "solid-js";
import Button from "./Button";
import InputGroup from "./InputGroup";
import InputText from "./InputText";
import { Color } from "./colors";

type InputFileProps = {
	class?: string;
	ref?: Ref<HTMLInputElement>;
	placeholder?: string;

	onChange?: JSX.ChangeEventHandler<HTMLInputElement, Event>;
};

const InputFile: Component<InputFileProps> = props => {
	let textRef;
	let fileRef: HTMLInputElement | undefined;
	const hackRef = (ref: HTMLInputElement) => {
		fileRef = ref;
		if (typeof props.ref === "function") props.ref(ref);
	};
	const handleChange: JSX.ChangeEventHandler<HTMLInputElement, Event> = e => {
		if (props.onChange) props.onChange(e);
		textRef!.value = fileRef!.value;
	};
	return (
		<InputGroup class={props.class}>
			<InputText
				class={`flex-1`}
				ref={textRef}
				value=""
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
