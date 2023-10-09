import { Component, Match, Switch, createSignal } from "solid-js";
import { Box, Getter, Updater } from "@/common";
import GraphToolsModal from "./GraphToolsModal";
import { State } from "@/hrm";

enum ModalType {
	None,
	Browser,
	Launch,
	GraphTools,
}

type ModalsState = {
	type: ModalType;
};

export class ModalActions {
	state: Getter<ModalsState>;
	setState: Updater<ModalsState>;

	constructor() {
		const [state, setState] = createSignal<ModalsState>({
			type: ModalType.None,
		});

		this.state = state;
		this.setState = setState;
	}

	close() {
		this.setState(s => ({
			...s,
			type: ModalType.None,
		}));
	}

	openGraphTools() {
		this.setState(s => ({
			...s,
			type: ModalType.GraphTools,
		}));
	}
}

type ModalsProps = {
	actionsBox: Box<ModalActions>;
	stateBox: Box<State>;
};

const Modals: Component<ModalsProps> = props => {
	const actions = new ModalActions();
	if (props.actionsBox) {
		props.actionsBox[0] = actions;
	}

	return (
		<Switch>
			<Match when={actions.state().type === ModalType.GraphTools}>
				<GraphToolsModal
					onClose={() => actions.close()}
					stateBox={props.stateBox}
				/>
			</Match>
		</Switch>
	);
};

export default Modals;