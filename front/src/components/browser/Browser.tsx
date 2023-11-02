import { Component } from "solid-js";
import BrowserHeader from "./BrowserHeader";
import { newState } from "./state";
import BrowserBodyDirectory from "./BrowserBodyDirectory";

type BrowserProps = {
	onClose: () => void;
};

const Browser: Component<BrowserProps> = props => {
	const state = newState("local:/");
	state.onClose = props.onClose;
	return (
		<>
			<BrowserHeader state={state} />
			<BrowserBodyDirectory state={state} />
		</>
	);
};

export default Browser;
