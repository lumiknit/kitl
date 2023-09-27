import { Component } from "solid-js";

import "./Hrm.scss";
import "./HrmColors.scss";
import { Nodes, NodesF } from "./data";
import HrmPane, { HrmTransform } from "./HrmPane";

import { toast } from "../block/ToastContainer";
import HrmNodes from "./HrmNodes";
import { VBox } from "../common/types";
import { GraphState } from "./state";

export type HrmProps = {
	initialNodes: NodesF;
};

export type HrmState = {
	nodes: Nodes;
};

const Hrm: Component<HrmProps> = props => {
	const g = new GraphState(props.initialNodes);
	const transform: VBox<HrmTransform> = [undefined, undefined];

	return (
		<div class="hrm-container">
			<HrmPane
				t={{
					x: 0,
					y: 0,
					z: 1,
				}}
				u={transform}
				onClick={e => g.deselectAll()}
				onDoubleClick={e => {
					toast("Double click " + e.pointers);
				}}
				onLongPress={e => {
					toast("Long press");
				}}>
				<HrmNodes g={g} />
			</HrmPane>
		</div>
	);
};

export default Hrm;
