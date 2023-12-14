import { Component, JSX } from "solid-js";

export type Props = {
	children?: JSX.Element | JSX.Element[];
};

const ModalBody: Component<Props> = props => {
	return <div class="b-m-body">
		{props.children}
	</div>;
};

export default ModalBody;