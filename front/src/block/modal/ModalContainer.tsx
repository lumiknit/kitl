import { Component } from "solid-js";
import { Portal } from "solid-js/web";

export type Props = {

};

const ModalContainer: Component<Props> = props => {
	return (
		<Portal>
			<div class="b-m-container">
			a
		</div>
		</Portal>
	);
};

export default ModalContainer;