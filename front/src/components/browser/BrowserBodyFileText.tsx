import InputCode from "@/block/InputCode";
import { Component, createSignal } from "solid-js";
import { StateWrap, saveFile } from "./state";
import { Button, Color, InputGroup } from "@/block";
import { TbUpload } from "solid-icons/tb";
import { s } from "@/locales";

const BrowserBodyFileText: Component<StateWrap> = props => {
	const [modified, setModified] = createSignal<boolean>(false);
	const markModified = () => setModified(true);
	const save = () => {
		if (modified()) {
			saveFile(props.state, ref!.value);
			setModified(false);
		}
	};
	let ref: HTMLTextAreaElement | undefined;

	const text = () => {
		const arr = props.state.data[0]();
		if (!arr) return "<NOT LOADED>";
		const decoder = new TextDecoder("utf-8");
		return decoder.decode(arr);
	};

	const Header: Component<any> = () => {
		return (
			<InputGroup class="my-1">
				<Button
					color={modified() ? Color.primary : Color.secondary}
					onClick={save}
					disabled={!modified()}
					class="flex-1">
					<TbUpload />
					&nbsp;{s("menu.save")}
				</Button>
			</InputGroup>
		);
	};

	return (
		<>
			<Header />
			<InputCode
				ref={ref}
				autoresize
				value={text()}
				onChange={markModified}
				onInput={markModified}
			/>
		</>
	);
};

export default BrowserBodyFileText;
