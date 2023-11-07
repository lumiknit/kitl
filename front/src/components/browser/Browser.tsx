import { Component } from "solid-js";
import BrowserHeader from "./BrowserHeader";
import { loadMeta, newState } from "./state";
import BrowserBody from "./BrowserBody";

type BrowserProps = {
	onClose: () => void;
};

const Browser: Component<BrowserProps> = props => {
	const state = newState("local:/");
	state.onClose = props.onClose;
	loadMeta(state);
	return (
		<>
			<BrowserHeader state={state} />
			<BrowserBody state={state} />
		</>
	);
};

export default Browser;
