import { Component, JSXElement, Ref } from "solid-js";

import { Color } from "./colors";

type ButtonProps = {
	ref?: Ref<HTMLButtonElement>;
	children: JSXElement;
	class?: string;
	color: Color;
	outline?: boolean;
	small?: boolean;
	onClick?: () => void;
	disabled?: boolean;
};

const Button: Component<ButtonProps> = props => {
	return (
		<button
			ref={props.ref}
			class={`no-user-select btn btn-${props.outline ? "ol-" : ""}${
				props.color
			} ${props.class ?? ""} ${props.small ? "btn-sm" : ""}`}
			onClick={props.onClick}
			disabled={props.disabled}>
			{props.children}
		</button>
	);
};

export default Button;
