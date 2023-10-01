import { Box } from "@/common";
import { State } from "@/hrm";
import { Component } from "solid-js";

import "./style.scss";
import HrmEditor from "./EditorHrm";
import EditorHrmHeader from "./EditorHrmHeader";

const MainEditor: Component = () => {
	const state: Box<State> = [undefined];
	return (
		<div class="editor-root">
			<HrmEditor stateBox={state} />
			<div class="editor-root-hrm-header-wrapper">
				<EditorHrmHeader stateBox={state} />
			</div>
		</div>
	);
};

export default MainEditor;
