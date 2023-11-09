import { Component, JSX, JSXElement } from "solid-js";

type InputGroupProps = {
	children: JSXElement;

	onClick?: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent>;
	onDrop?: JSX.EventHandlerUnion<HTMLDivElement, DragEvent>;

	class?: string;
};

const InputGroup: Component<InputGroupProps> = props => {
	return (
		<div
			class={`input-group ${props.class ?? ""}`}
			onClick={props.onClick}
			onDrop={props.onDrop}>
			{props.children}
		</div>
	);
};

export default InputGroup;
