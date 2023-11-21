import { Button, Color } from "@/block";
import { Component, Match, Switch } from "solid-js";

import "./EditorHrmFab.scss";
import { TbPlus, TbTrash } from "solid-icons/tb";
import { State } from "@/hrm";

type Props = {
	state: State;
};

const EditorHrmFab: Component<Props> = props => {
	const selected = () => props.state.selectedNodes[0]() > 0;
	return (
		<Button
			class="hrm-fab shadow-2	"
			color={selected() ? Color.danger : Color.primary}
			onClick={() =>
				selected()
					? props.state.deleteSelectedNodes()
					: props.state.addEmptyNode()
			}>
			<Switch>
				<Match when={selected()}>
					<TbTrash />
				</Match>
				<Match when={true}>
					<TbPlus />
				</Match>
			</Switch>
		</Button>
	);
};

export default EditorHrmFab;
