import { Component, JSXElement, type JSX } from "solid-js";

export type TextProps = {
	class?: string;
	placeholder?: string;
	value?: string;

	onChange?: JSX.ChangeEventHandler<HTMLInputElement, Event>;
	onKeyDown?: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent>;
};

const InputText: Component<TextProps> = props => {
	return (
		<input
			type="text"
			class={`form-control ${props.class ?? ""}`}
			placeholder={props.placeholder}
			value={props.value}
			onChange={props.onChange}
			onKeyDown={props.onKeyDown}
		/>
	);
};

export default InputText;
