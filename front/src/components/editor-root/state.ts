import { VWrap } from "@/common";
import { State as HrmState } from "@/hrm";
import { ModalActions } from "./Modals";
import { DefValue } from "@/common/kitl";
import { createSignal } from "solid-js";

export type State = {
	hrm: VWrap<HrmState>;
	modalActions: VWrap<ModalActions>;
};

export const newState = (): State => ({
	hrm: createSignal<HrmState>(
		new HrmState("local:/.scratch.kitl", "default"),
	),
	modalActions: createSignal<ModalActions>(new ModalActions()),
});

export const editFile = (
	state: State,
	path: string,
	name: string,
	def: DefValue,
) => {
	state.hrm[1](new HrmState(path, name, def.value));
};
