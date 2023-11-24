import { For, createSignal } from "solid-js";
import { Color } from "./colors";
import InputGroup from "./InputGroup";
import Button from "./Button";

export type RadioButton<T> = {
	color: Color;
	label: string;
	value: T;
	class?: string;
};

type Props<T> = {
	class?: string;
	initialValue: T;
	buttons: RadioButton<T>[];
	onChange?: (value: T) => void;
};

function RadioButtons<T>(props: Props<T>) {
	// Find the button with the initial value
	const index = props.buttons.findIndex(
		btn => btn.value === props.initialValue,
	);
	const [selected, setSelected] = createSignal<number>(index);
	const handleChange = (index: number) => {
		setSelected(index);
		props.onChange?.(props.buttons[index].value);
	};
	return (
		<InputGroup class={props.class}>
			<For each={props.buttons}>
				{(btn, idx) => (
					<Button
						color={btn.color}
						outline={selected() !== idx()}
						class={btn.class}
						onClick={() => handleChange(idx())}>
						{btn.label}
					</Button>
				)}
			</For>
		</InputGroup>
	);
}

export default RadioButtons;
