import { Component, Show } from "solid-js";
import BrowserHeader from "./BrowserHeader";
import { StateWrap, loadMeta, newState } from "./state";
import BrowserBody from "./BrowserBody";
import BrowserUploading from "./BrowserUploading";

import "./styles.scss";
import { s } from "@/locales";

type BrowserProps = {
	onClose: () => void;
};

const WarningLocal: Component<StateWrap> = props => (
	<Show when={props.state.path[0]().startsWith("local:")}>
		<div class="em-075">⚠️ {s("fileBrowser.warningLocal")}</div>
	</Show>
);

const Browser: Component<BrowserProps> = props => {
	const state = newState("local:/");
	state.onClose = props.onClose;
	loadMeta(state);
	return (
		<>
			<BrowserHeader state={state} />
			<WarningLocal state={state} />
			<BrowserUploading state={state} />
			<BrowserBody state={state} />
		</>
	);
};

export default Browser;
