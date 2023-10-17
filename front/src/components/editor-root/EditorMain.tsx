import { Box, emptyBox } from "@/common";
import { State } from "@/hrm";
import { Component } from "solid-js";

import "./style.scss";
import HrmEditor from "./EditorHrm";
import EditorHrmHeader from "./EditorHrmHeader";
import Modals, { ModalActions } from "./Modals";

const MainEditor: Component = () => {
	const state: Box<State> = emptyBox();
	const modalActionsBox: Box<ModalActions> = emptyBox();
	return (
		<div class="editor-root">
			<HrmEditor stateBox={state} />
			<EditorHrmHeader
				stateBox={state}
				modalActionsBox={modalActionsBox}
			/>
			<Modals actionsBox={modalActionsBox} stateBox={state} />
		</div>
	);
};

export default MainEditor;
