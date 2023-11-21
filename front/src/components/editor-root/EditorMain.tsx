import { Component } from "solid-js";

import "./style.scss";
import HrmEditor from "./EditorHrm";
import EditorHrmHeader from "./EditorHrmHeader";
import Modals from "./Modals";
import { editValueDef, newState } from "./state";
import EditorHrmFab from "./EditorHrmFab";

const MainEditor: Component = () => {
	const state = newState();
	return (
		<div class="editor-root">
			<HrmEditor state={state.hrm[0]()} />
			<EditorHrmHeader state={state} />
			<EditorHrmFab state={state.hrm[0]()} />
			<Modals
				actions={state.modalActions[0]()}
				state={state.hrm[0]()}
				editValueDef={(path: string, name: string) =>
					editValueDef(state, path, name)
				}
			/>
		</div>
	);
};

export default MainEditor;
