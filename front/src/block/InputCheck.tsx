import { Component, type JSX } from "solid-js";

import {
	IconArrowRight,
	IconBox,
	IconCheckbox,
	IconSquare,
} from "@tabler/icons-solidjs";

export type TextProps = {
	children: JSX.Element;

	class?: string;
	checked?: boolean;

	onChange?: JSX.ChangeEventHandler<HTMLInputElement, Event>;
	onKeyDown?: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent>;
};

const InputText: Component<TextProps> = props => {
	let ref;
	console.log(ref);
	return (
		<>
			<label class="checkbox">
				<input
					ref={ref}
					type="checkbox"
					class={props.class}
					checked={props.checked}
					onChange={props.onChange}
					onKeyDown={props.onKeyDown}
				/>
				<span>{props.children}</span>
			</label>
		</>
	);
};

export default InputText;