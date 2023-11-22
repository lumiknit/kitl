import { Component, Match, Switch, createSignal } from "solid-js";
import { Getter, Updater } from "@/common";
import GraphToolsModal from "./GraphToolsModal";
import { State as HrmState } from "@/hrm";
import BrowserModal from "../browser/BrowserModal";
import { Dynamic } from "solid-js/web";
import LaunchModal from "./LaunchModal";

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
	state: HrmState;
	// Helpers
	editValueDef: (path: string, name: string) => Promise<void>;
};

const ModalComponents = {
	[ModalType.None]: (p: ModalsProps) => null,
	[ModalType.Launch]: LaunchModal,
	[ModalType.GraphTools]: GraphToolsModal,
	[ModalType.Browser]: BrowserModal,
};

const Modals: Component<ModalsProps> = props => {
	return (
		<Dynamic
			component={ModalComponents[props.actions.state().type]}
			onClose={() => props.actions.close()}
			{...props}
		/>
	);
};

export default Modals;
