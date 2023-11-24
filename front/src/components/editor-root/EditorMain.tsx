import { Component } from "solid-js";

import "./style.scss";
import HrmEditor from "./EditorHrm";
import EditorHrmHeader from "./EditorHrmHeader";
import Modals from "./Modals";
import { newState } from "./state";
import EditorHrmFab from "./EditorHrmFab";

const MainEditor: Component = () => {
	const state = newState();

	return (
		<div class="editor-root">
			<HrmEditor state={state.hrm[0]()} />
			<EditorHrmHeader state={state} />
			<EditorHrmFab state={state.hrm[0]()} />
			<Modals state={state} />
		</div>
	);
};

export default MainEditor;
