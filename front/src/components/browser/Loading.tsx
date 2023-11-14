import { Spinner } from "@/block";
import { Component, JSX } from "solid-js";

type LoadingProps = {
	children?: JSX.Element;
};

const Loading: Component<LoadingProps> = props => (
	<div class="m-2 text-center em-2">
		<Spinner />
		{props.children}
	</div>
);

export default Loading;
