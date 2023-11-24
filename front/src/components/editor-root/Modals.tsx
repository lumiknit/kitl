import { Component, Show, createSignal } from "solid-js";
import { VWrap } from "@/common";
import GraphToolsModal, { GraphToolsModalProps } from "./GraphToolsModal";
import BrowserModal, { BrowserModalProps } from "../browser/BrowserModal";
import LaunchModal, { LaunchModalProps } from "./LaunchModal";
import NodeEditModal, { NodeEditModalProps } from "./NodeEditModal";
import { State } from "./state";
import { Dynamic } from "solid-js/web";

export enum ModalType {
	Browser,
	Launch,
	GraphTools,
	NodeEdit,
}

const ModalComponents = {
	[ModalType.Launch]: LaunchModal,
	[ModalType.GraphTools]: GraphToolsModal,
	[ModalType.Browser]: BrowserModal,
	[ModalType.NodeEdit]: NodeEditModal,
};

type BrowserModalState = {
	type: ModalType.Browser;
} & BrowserModalProps;

type LaunchModalState = {
	type: ModalType.Launch;
} & LaunchModalProps;

type GraphToolsModalState = {
	type: ModalType.GraphTools;
} & GraphToolsModalProps;

type NodeEditModalState = {
	type: ModalType.NodeEdit;
} & NodeEditModalProps;

type ModalsState =
	| BrowserModalState
	| LaunchModalState
	| GraphToolsModalState
	| NodeEditModalState;

export class ModalActions {
	state: VWrap<ModalsState | undefined>;

	constructor() {
		this.state = createSignal<ModalsState | undefined>();
	}

	close() {
		this.state[1](undefined);
	}

	open(state: ModalsState) {
		this.state[1](state);
	}
}

type ModalsProps = {
	state: State;
};

const Modals: Component<ModalsProps> = props => {
	const modalState = () => props.state.modalActions[0]().state[0]();
	return (
		<Show when={modalState()}>
			<Dynamic
				component={ModalComponents[modalState()!.type]}
				{...modalState()!}
			/>
		</Show>
	);
};

export default Modals;
