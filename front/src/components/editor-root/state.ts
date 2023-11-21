import { VWrap } from "@/common";
import { State as HrmState } from "@/hrm";
import { ModalActions } from "./Modals";
import { ValueDef, defsJsonPath, loadDefFns } from "@/common/kitl/defs";
import { createSignal } from "solid-js";
import { freezeValueDef, thawValueDef } from "@/hrm-kitl";
import { clients } from "@/client";

export type State = {
	hrm: VWrap<HrmState>;
	modalActions: VWrap<ModalActions>;
};

const scratchHrmState = (): HrmState => {
	const emptyValueDef = (): ValueDef => ({
		type: "value",
		nodes: [],
		comment: "",
	});
	return new HrmState(
		"local:/.scratch.kitl",
		"default",
		thawValueDef(emptyValueDef()),
	);
};

const initHrmState = (state: State, h: HrmState): HrmState => {
	//TODO
};

export const newState = (): State => ({
	hrm: createSignal<HrmState>(scratchHrmState()),
	modalActions: createSignal<ModalActions>(new ModalActions()),
});

export const editValueDef = async (
	state: State,
	path: string,
	name: string,
) => {
	const j = await clients.readJson(path, defsJsonPath(name));
	const def = loadDefFns.value(j);
	const newHrmState = new HrmState(path, name, thawValueDef(def));
	console.log(newHrmState);
	state.hrm[1](newHrmState);
};

export const saveToFile = async (state: State) => {
	const hrm = state.hrm[0]();
	const valueDef = freezeValueDef(state.hrm[0]().nodes());
	const j = loadDefFns.value(valueDef);
	console.log(j);
	await clients.writeJson(hrm.path, defsJsonPath(hrm.name), j);
};
