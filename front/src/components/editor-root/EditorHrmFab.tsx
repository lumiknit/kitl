import { Button, Color } from "@/block";
import { Component, Match, Switch, onMount } from "solid-js";

import "./EditorHrmFab.scss";
import { TbPlus, TbTrash } from "solid-icons/tb";
import { addEventListeners } from "@/common/pointer-helper";
import { State, openMetaModal } from "./state";

type Props = {
	state: State;
};

const EditorHrmFab: Component<Props> = props => {
	let buttonRef: HTMLButtonElement | undefined;
	const hrmState = () => props.state.hrm[0]();
	const selected = () => hrmState().selectedNodes[0]() > 0;
	onMount(() => {
		if (!buttonRef) return;
		addEventListeners(
			{
				capture: true,
				onClick: () => {
					if (selected()) {
						hrmState().deleteSelectedNodes();
					} else {
						const id = hrmState().addEmptyNode();
						hrmState().editNode(id);
					}
				},
				onLongPress: () => {
					// Open menu
					if(navigator.vibrate)
						navigator.vibrate(10);
					openMetaModal(props.state);
				},
			},
			buttonRef,
		);
	});
	return (
		<Button
			ref={buttonRef}
			class="hrm-fab shadow-2	"
			color={selected() ? Color.danger : Color.primary}>
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
