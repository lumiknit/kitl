import { Component, For, JSXElement, Show, createSignal } from "solid-js";

import { Color } from "./colors";

type DropdownButtonProps = {
	children: JSXElement;
	list: JSXElement[][];
	class?: string;
	color: Color;
	outline?: boolean;
};

const DropdownButton: Component<DropdownButtonProps> = props => {
	const [visible, setVisible] = createSignal(false);
	return (
		<div class="dropdown">
			<button
				class={`btn btn-${props.outline ? "ol-" : ""}${props.color} ${
					props.class ?? ""
				}`}
				onClick={() => {
					setVisible(!visible());
				}}>
				{props.children}
			</button>
			<div
				class={`dropdown-menu ${visible() ? "visible" : "hidden"}`}
				onClick={() => {
					setVisible(false);
				}}>
				<For each={props.list}>
					{(item) => (
						<>
							<Show when={item.length > 0}>
								<hr />
							</Show>
							<For each={item}>{item => item}</For>
						</>
					)}
				</For>
			</div>
		</div>
	);
};

export default DropdownButton;
