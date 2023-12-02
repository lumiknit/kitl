import { VWrap } from "@/common";
import { State as HrmState } from "@/hrm";
import { ModalActions, ModalType } from "./Modals";
import { ValueDef, defsJsonPath, loadDefFns } from "@/common/kitl/defs";
import { createEffect, createSignal, untrack } from "solid-js";
import { freezeValueDef, thawValueDef } from "@/hrm-kitl";
import { clients } from "@/client";

// Defs

export enum ToolSet {
	Default,
	Edit,
}

// State

export type State = {
	toolSet: VWrap<ToolSet>;
	lastToolSet: ToolSet;
	hrm: VWrap<HrmState>;
	modalActions: VWrap<ModalActions>;
};

const scratchHrmState = (): HrmState => {
	const emptyValueDef = (): ValueDef => ({
		type: "value",
		nodes: [],
		comment: "Test",
	});
	return new HrmState(
		"local:/.kitl/scratch.kitl",
		"default",
		thawValueDef(emptyValueDef()),
	);
};

const postInitHrmState = (state: State) => {
	// Handler after HrmState is initialized
	const hrmState = untrack(state.hrm[0]);
	hrmState.onEditNode = id => openNodeEditModal(state, id);
	createEffect(() =>
		hrmState.selectedNodes[0]() < 1
			? restoreMode(state)
			: changeMode(state, ToolSet.Edit),
	);
	setTimeout(() => {
		hrmState.zoomAll();
	}, 16);
};

export const newState = (): State => {
	const s = {
		toolSet: createSignal<ToolSet>(ToolSet.Default),
		lastToolSet: ToolSet.Default,
		hrm: createSignal<HrmState>(scratchHrmState()),
		modalActions: createSignal<ModalActions>(new ModalActions()),
	};
	postInitHrmState(s);
	return s;
};

export const editValueDef = async (
	state: State,
	path: string,
	name: string,
) => {
	const j = await clients.readJson(path, defsJsonPath(name));
	const def = loadDefFns.value(j);
	const newHrmState = new HrmState(path, name, thawValueDef(def));
	state.hrm[1](newHrmState);
	postInitHrmState(state);
};

export const saveToFile = async (state: State) => {
	const hrm = state.hrm[0]();
	const valueDef = freezeValueDef(state.hrm[0]().nodes());
	const j = loadDefFns.value(valueDef);
	await clients.writeJson(hrm.path, defsJsonPath(hrm.name), j);
};

export const changeMode = (state: State, mode: ToolSet) => {
	const currentToolSet = untrack(state.toolSet[0]);
	if (currentToolSet !== mode) {
		state.lastToolSet = currentToolSet;
		state.toolSet[1](mode);
		state.hrm[0]().selectMode = mode === ToolSet.Edit;
	}
};

export const restoreMode = (state: State) => {
	state.toolSet[1](state.lastToolSet);
};

// Modals

export const openMetaModal = (state: State) => {
	state.modalActions[0]().open({
		type: ModalType.Meta,
		state: state,
		onClose: () => state.modalActions[0]().close(),
	});
};

export const openBrowserModal = (state: State) => {
	state.modalActions[0]().open({
		type: ModalType.Browser,
		initialPath: state.hrm[0]().path,
		editValueDef: (path, name) => editValueDef(state, path, name),
		onClose: () => state.modalActions[0]().close(),
	});
};

export const openGraphToolsModal = (state: State) => {
	state.modalActions[0]().open({
		type: ModalType.GraphTools,
		state: state.hrm[0](),
		onClose: () => state.modalActions[0]().close(),
	});
};

export const openNodeEditModal = (state: State, id: string) => {
	const hrmState = state.hrm[0]();
	state.modalActions[0]().open({
		type: ModalType.NodeEdit,
		id,
		initValue: hrmState.getNodeStringData(id),
		onApply: value => {
			hrmState.applyEditNode(id, value);
			state.modalActions[0]().close();
		},
		onClose: () => state.modalActions[0]().close(),
	});
};

export const openLaunchModal = (state: State) => {
	state.modalActions[0]().open({
		type: ModalType.Launch,
		state: state.hrm[0](),
		onClose: () => state.modalActions[0]().close(),
	});
};
