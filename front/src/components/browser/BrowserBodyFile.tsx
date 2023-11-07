import { Component, Show, createEffect, createSignal } from "solid-js";
import { State, loadData } from "./state";
import { bufferToBase64, filename, splitFilenameExt } from "@/common";
import { Dynamic } from "solid-js/web";

type BrowserFileProps = {
	state: State;
};

enum BrowserFileTypes {
	IMAGE,
	TEXT,
}

const IMAGE_EXTENSIONS = new Set([
	"apng",
	"gif",
	"jpg",
	"jpeg",
	"jfif",
	"pjpeg",
	"pjp",
	"png",
	"svg",
	"webp",
]);

export const BrowserBodyFile: Component<BrowserFileProps> = props => {
	createEffect(() => {
		loadData(props.state);
	});
	const splitted = () => splitFilenameExt(filename(props.state.path[0]()));
	const Image: Component<any> = () => {
		const [b64, setB64] = createSignal("");
		createEffect(() => {
			const data = props.state.data[0]();
			if (data !== undefined) {
				bufferToBase64(data).then(setB64);
			}
		});
		// Convert src to base64
		const src = () => {
			const data = props.state.data[0]();
			if (data === undefined) return "";
			return `data:image/${splitted()[1]};base64,${b64()}`;
		};
		return <img class="browser-image" src={src()} />;
	};

	const Text: Component<any> = () => {
		return <pre>{props.state.path[0]()}</pre>;
	};

	const Fallback: Component<any> = () => {
		return <pre>Failed to load file.</pre>;
	};

	const type = () => {
		if (IMAGE_EXTENSIONS.has(splitted()[1])) return BrowserFileTypes.IMAGE;
		return BrowserFileTypes.TEXT;
	};

	return (
		<Show
			when={props.state.data[0]() !== undefined}
			fallback={<Fallback />}>
			<Dynamic
				component={type() === BrowserFileTypes.IMAGE ? Image : Text}
			/>
		</Show>
	);
};

export default BrowserBodyFile;
