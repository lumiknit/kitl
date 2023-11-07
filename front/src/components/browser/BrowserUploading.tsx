import { Component, For, Show } from "solid-js";
import { State } from "./state";
import { s } from "@/locales";

type BrowserUploadingProps = {
	state: State;
};

const BrowserUploading: Component<BrowserUploadingProps> = props => {
	const uploads = () => props.state.uploads[0]();
	return (
		<Show when={uploads().size > 0}>
			<h3> {s("fileBrowser.title.uploading")} </h3>
			<ul>
				<For each={Array.from(props.state.uploads[0]())}>
					{file => <li>{file}</li>}
				</For>
			</ul>
		</Show>
	);
};

export default BrowserUploading;
