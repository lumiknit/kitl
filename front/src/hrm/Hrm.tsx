import { Component } from "solid-js";

import { toast } from "@/block/ToastContainer";
import { Nodes as CNodes } from "@/common";

import { Nodes } from "./data";
import HrmPane from "./HrmPane";
import HrmNodes from "./HrmNodes";

import { State } from "./state";

import "./Hrm.scss";
import "./HrmColors.scss";
import HrmEditingEdge from "./HrmEditingEdge";

export type HrmProps = {
	initialNodes: CNodes;
};

export type HrmState = {
	nodes: Nodes;
};

const Hrm: Component<HrmProps> = props => {
	const g = new State(props.initialNodes);
	return (
		<div ref={g.rootRef} class="hrm-container">
			<HrmPane
				g={g}
				onClick={() => g.deselectAll()}
				onDoubleClick={e => {
					toast("[Hrm] Double click " + e.pointers);
				}}
				onLongPress={() => {
					toast("[Hrm] Long press");
				}}>
				<HrmNodes g={g} />
				<HrmEditingEdge g={g} />
			</HrmPane>
		</div>
	);
};

export default Hrm;
