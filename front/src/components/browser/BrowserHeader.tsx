import { Button, Color, InputGroup, InputText } from "@/block";
import { TbFolderUp, TbMenu, TbTrashOff, TbX } from "solid-icons/tb";
import { Component } from "solid-js";
import { StateWrap, cd, cdParent, resetLocal } from "./state";
import DropdownButton from "@/block/DropdownButton";
import { s } from "@/locales";

const BrowserHeader: Component<StateWrap> = props => {
	const list = () => [
		[
			<a onClick={() => resetLocal(props.state)}>
				<TbTrashOff />
				&nbsp; {s("fileBrowser.menu.formatLocalStorage")}
			</a>,
		],
	];
	let pathRef;
	const handlePathChange = () => {
		cd(props.state, pathRef!.value);
	};
	return (
		<InputGroup class="sticky-top shadow-1 mb-2">
			<DropdownButton color={Color.primary} list={list()}>
				<TbMenu />
			</DropdownButton>
			<Button
				color={Color.secondary}
				onClick={() => cdParent(props.state)}>
				<TbFolderUp />
			</Button>
			<InputText
				ref={pathRef}
				class="flex-1"
				value={props.state.path[0]()}
				onBlur={handlePathChange}
				onKeyDown={e => {
					if (e.key === "Enter") {
						pathRef!.blur();
					}
				}}
			/>
			<Button color={Color.danger} onClick={props.state.onClose}>
				<TbX />
			</Button>
		</InputGroup>
	);
};

export default BrowserHeader;
