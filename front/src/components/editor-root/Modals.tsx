import { Component, Match, Switch, createSignal } from "solid-js";
import { Getter, Updater } from "@/common";
import GraphToolsModal from "./GraphToolsModal";
import { State } from "@/hrm";
import BrowserModal from "../browser/BrowserModal";

export enum ModalType {
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

	open(type: ModalType) {
		this.setState(s => ({
			...s,
			type: type,
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
	actions: ModalActions;
	state: State;
};

const Modals: Component<ModalsProps> = props => {
	return (
		<Switch>
			<Match when={props.actions.state().type === ModalType.GraphTools}>
				<GraphToolsModal
					onClose={() => props.actions.close()}
					state={props.state}
				/>
			</Match>
			<Match when={props.actions.state().type === ModalType.Browser}>
				<BrowserModal onClose={() => props.actions.close()} />
			</Match>
		</Switch>
	);
};

export default Modals;
