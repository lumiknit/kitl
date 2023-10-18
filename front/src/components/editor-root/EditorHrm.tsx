import { Box, emptyGraph } from "@/common";
import { Hrm, State } from "@/hrm";
import { Component } from "solid-js";

import "./style.scss";

type HrmEditorProps = {
	stateBox: Box<State>;
};

const HrmEditor: Component<HrmEditorProps> = props => {
	return (
		<div class="editor-root-hrm abs-parent">
			<Hrm initialNodes={emptyGraph()} stateBox={props.stateBox} />
		</div>
	);
};

export default HrmEditor;
