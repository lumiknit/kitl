import { Component, Ref, type JSX } from "solid-js";

type Props = {
	class?: string;
	readonly?: boolean;
	placeholder?: string;
	value?: string;
	ref?: Ref<HTMLInputElement>;

	onClick?: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent>;
	onChange?: JSX.ChangeEventHandler<HTMLInputElement, Event>;
	onKeyDown?: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent>;
	onBlur?: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent>;
};

const InputText: Component<Props> = props => {
	return (
		<input
			type="text"
			readOnly={props.readonly}
			class={`form-control ${props.class ?? ""}`}
			ref={props.ref}
			placeholder={props.placeholder}
			value={props.value ?? ""}
			onClick={props.onClick}
			onChange={props.onChange}
			onKeyDown={props.onKeyDown}
			onBlur={props.onBlur}
		/>
	);
};

export default InputText;
