import { Component } from "solid-js";

type SpinnerProps = {
	class?: string;
};

const Spinner: Component<SpinnerProps> = props => (
	<span class={`spinner ${props.class}`} />
);

export default Spinner;
