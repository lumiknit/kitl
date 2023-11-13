import { Component } from "solid-js";

import "./style.scss";
import HrmEditor from "./EditorHrm";
import EditorHrmHeader from "./EditorHrmHeader";
import Modals from "./Modals";
import { newState } from "./state";

const MainEditor: Component = () => {
	const state = newState();
	return (
		<div class="editor-root">
			<HrmEditor state={state.hrm[0]()} />
			<EditorHrmHeader state={state} />
			<Modals actions={state.modalActions[0]()} state={state.hrm[0]()} />
		</div>
	);
};

export default MainEditor;
