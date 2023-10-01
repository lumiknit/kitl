import { Component, JSXElement } from "solid-js";

export type TextProps = {
	children: JSXElement;
	class?: string;
	color: string;
	outline?: boolean;
};

const InputLabel: Component<TextProps> = props => {
	return (
		<div
			class={`form-control btn-${props.outline ? "ol-" : ""}${
				props.color
			} ${props.class ?? ""}`}>
			{props.children}
		</div>
	);
};

export default InputLabel;
