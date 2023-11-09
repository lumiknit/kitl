import { Component, Match, Switch, createEffect, createSignal } from "solid-js";
import { StateWrap, isFileLarge, loadData } from "./state";
import {
	FileType,
	bufferToBase64,
	downloadArray,
	filename,
	getFileType,
	splitFilenameExt,
} from "@/common";
import { Dynamic } from "solid-js/web";
import { Button, Color } from "@/block";
import { clients } from "@/client";
import Loading from "./Loading";
import InputCode from "@/block/InputCode";
import { s } from "@/locales";
import { TbDownload } from "solid-icons/tb";

const Image: Component<StateWrap> = props => {
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

const Text: Component<StateWrap> = props => {
	const text = () => {
		const arr = props.state.data[0]();
		if (!arr) return "<NOT LOADED>";
		const decoder = new TextDecoder("utf-8");
		return decoder.decode(arr);
	};
	return <InputCode autoresize value={text()} />;
};

const components = new Map<FileType, Component<StateWrap>>([
	[FileType.Unknown, Text],
	[FileType.Kitl, Text],
	[FileType.Image, Image],
]);

export const BrowserBodyFile: Component<StateWrap> = props => {
	const isLarge = isFileLarge(props.state);
	const [show, setShow] = createSignal(!isLarge);
	if (!isLarge) {
		loadData(props.state);
	}
	const loadAndShow = async () => {
		setShow(true);
		loadData(props.state);
	};
	const extension = () =>
		splitFilenameExt(filename(props.state.path[0]()))[1];
	const type = () => getFileType(extension());
	return (
		<Switch>
			<Match when={!show()}>
				<div class="w-100 text-center">
					{s("fileBrowser.fileTooLarge.message")}
					<br />({props.state.storageItem[0]()!.size} bytes).
					<br />
					<Button color={Color.primary} onClick={loadAndShow}>
						{s("fileBrowser.fileTooLarge.show")}
					</Button>
					<Button
						color={Color.secondary}
						onClick={async () => {
							const path = props.state.storageItem[0]()!.path;
							const name = filename(path);
							const array = await clients.read(path);
							downloadArray(name, array);
						}}>
						<TbDownload />
						&nbsp;
						{s("fileBrowser.fileTooLarge.download")}
					</Button>
				</div>
			</Match>
			<Match when={props.state.data[0]() === undefined}>
				<Loading>Loading data...</Loading>
			</Match>
			<Match when={true}>
				<Dynamic
					component={components.get(type())}
					state={props.state}
				/>
			</Match>
		</Switch>
	);
};

export default BrowserBodyFile;
