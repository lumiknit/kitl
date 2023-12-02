import { Component, JSX, Ref, Show, createSignal } from "solid-js";

type Props = {
	ref?: Ref<HTMLInputElement>;
	children?: JSX.Element;
	value?: boolean;
	onChange?: (value: boolean) => void;
};

const Checkbox: Component<Props> = props => {
	const [checked, setChecked] = createSignal(props.value);
	const handleChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		console.log(target.checked);
		setChecked(target.checked);
		props.onChange?.(target.checked);
	};
	return (
		<label class="checkbox">
			<div class="checkbox-box no-user-select cursor-pointer">
				<Show when={checked()}>
					<svg stroke-width={0.125} viewBox="0 0 1 1">
						// Check shape
						<path
							d="
							M 0.2 0.5
							L 0.45 0.75
							L 0.9 0.25
						"
						/>
					</svg>
				</Show>
			</div>
			<input
				type="checkbox"
				name="checkbox"
				checked={props.value}
				ref={props.ref}
				onChange={handleChange}
			/>
			{props.children}
		</label>
	);
};

export default Checkbox;
