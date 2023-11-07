import { Component } from "solid-js";
import BrowserHeader from "./BrowserHeader";
import { loadMeta, newState } from "./state";
import BrowserBody from "./BrowserBody";
import BrowserUploading from "./BrowserUploading";

import "./styles.scss";

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
			<BrowserUploading state={state} />
			<BrowserBody state={state} />
		</>
	);
};

export default Browser;
