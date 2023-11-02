import { Button, Color, InputGroup, InputText } from "@/block";
import InputLabel from "@/block/InputLabel";
import { TbFolderSearch, TbX } from "solid-icons/tb";
import { Component } from "solid-js";
import { State } from "./state";

type BrowserHeaderProps = {
	state: State;
};

const BrowserHeader: Component<BrowserHeaderProps> = props => {
	return (
		<InputGroup>
			<InputLabel color={Color.primary}>
				<TbFolderSearch />
			</InputLabel>
			<InputText class="flex-1" disabled={true} value="Browser Tools" />
			<Button color={Color.danger} onClick={props.state.onClose}>
				<TbX />
			</Button>
		</InputGroup>
	);
};

export default BrowserHeader;
