import { Component, JSXElement } from "solid-js";

import { Color } from "./colors";

type ButtonProps = {
	children: JSXElement;
	class?: string;
	color: Color;
	outline?: boolean;
	onClick?: () => void;
	disabled?: boolean;
};

const Button: Component<ButtonProps> = props => {
	return (
		<button
			class={`btn btn-${props.outline ? "ol-" : ""}${props.color} ${
				props.class ?? ""
			}`}
			onClick={props.onClick}
			disabled={props.disabled}>
			{props.children}
		</button>
	);
};

export default Button;
