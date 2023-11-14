import { Hrm, State } from "@/hrm";
import { Component } from "solid-js";

import "./style.scss";

type HrmEditorProps = {
	state: State;
};

const HrmEditor: Component<HrmEditorProps> = props => {
	return (
		<div class="editor-root-hrm abs-parent">
			<Hrm state={props.state} />
		</div>
	);
};

export default HrmEditor;
