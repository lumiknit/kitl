import { Component } from "solid-js";

type Props = {
	class?: string;
};

const Spinner: Component<Props> = props => (
	<span class={`spinner ${props.class}`} />
);

export default Spinner;
