import { Component } from "solid-js";

import { toast } from "@/block/ToastContainer";
import { Box, Nodes as CNodes } from "@/common";

import { Nodes } from "./data";
import HrmPane from "./HrmPane";
import HrmNodes from "./HrmNodes";

import { State } from "./state";

import "./Hrm.scss";
import "./HrmColors.scss";
import HrmEditingEdge from "./HrmEditingEdge";

export type HrmProps = {
	initialNodes?: CNodes;
	stateBox?: Box<State>;
};

export type HrmState = {
	nodes: Nodes;
};

const Hrm: Component<HrmProps> = props => {
	const g = new State(props.initialNodes);
	if (props.stateBox) {
		props.stateBox[0] = g;
	}
	return (
		<div ref={g.rootRef} class="hrm-container">
			<HrmPane
				g={g}
				onClick={() => g.deselectAll()}
				onDoubleClick={e => {
					const p = g.viewPos(e.x, e.y);
					g.addEmptyNode(p);
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
