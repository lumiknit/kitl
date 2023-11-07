import { Button, Color, InputGroup, InputText } from "@/block";
import { TbFolderSearch, TbTrashOff, TbX } from "solid-icons/tb";
import { Component } from "solid-js";
import { State, cd } from "./state";
import DropdownButton from "@/block/DropdownButton";
import { clients } from "@/client";

type BrowserHeaderProps = {
	state: State;
};

const BrowserHeader: Component<BrowserHeaderProps> = props => {
	const list = () => [
		[
			<a
				onClick={() => {
					clients.local.format();
					cd(props.state, "local:/");
				}}>
				{" "}
				<TbTrashOff />
				&nbsp; Format Local Storage{" "}
			</a>,
		],
	];
	let pathRef;
	const handlePathChange = () => {
		cd(props.state, pathRef!.value);
	};
	return (
		<InputGroup>
			<DropdownButton color={Color.primary} list={list()}>
				<TbFolderSearch />
			</DropdownButton>
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
