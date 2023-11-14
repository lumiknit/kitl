import { Component, createEffect, createSignal } from "solid-js";
import { StateWrap } from "./state";
import { bufferToBase64 } from "@/common";

const BrowserBodyFileImage: Component<StateWrap> = props => {
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
		return `data:image;base64,${b64()}`;
	};
	return <img class="browser-image" src={src()} />;
};

export default BrowserBodyFileImage;
