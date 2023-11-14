import { Component, JSX, Ref } from "solid-js";

type CheckboxProps = {
	ref?: Ref<HTMLInputElement>;
	children?: JSX.Element;
	value?: boolean;
	onChange?: (value: boolean) => void;
};

const Checkbox: Component<CheckboxProps> = props => {
	const handleChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		console.log(target.checked);
		props.onChange?.(target.checked);
	};
	return (
		<div class="checkbox no-user-select cursor-pointer">
			<label>
				<input
					type="checkbox"
					name="checkbox"
					checked={props.value}
					ref={props.ref}
					onChange={handleChange}
				/>
				{props.children}
			</label>
		</div>
	);
};

export default Checkbox;
