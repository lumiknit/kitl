import { Component, For, Show } from "solid-js";
import { State } from "./state";
import { s } from "@/locales";
import { Spinner } from "@/block";

type BrowserUploadingProps = {
	state: State;
};

const BrowserUploading: Component<BrowserUploadingProps> = props => {
	const uploads = () => props.state.uploads[0]();
	return (
		<Show when={uploads().size > 0}>
			<h3>
				{" "}
				<Spinner /> {s("fileBrowser.title.uploading")}{" "}
			</h3>
			<ul>
				<For each={Array.from(uploads())}>
					{file => <li>{file}</li>}
				</For>
			</ul>
		</Show>
	);
};

export default BrowserUploading;
