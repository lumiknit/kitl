import { Component, JSXElement } from "solid-js";

type InputGroupProps = {
	children: JSXElement;

	class?: string;
};

const InputGroup: Component<InputGroupProps> = props => {
	return (
		<div class={`input-group ${props.class ?? ""}`}>{props.children}</div>
	);
};

export default InputGroup;
