import { Component } from "solid-js";

import { toast } from "@/block/ToastContainer";
import { Box, Nodes as CNodes } from "@/common";

import { Nodes } from "./data";
import HrmPane from "./HrmPane";
import HrmNodes from "./HrmNodes";

import { State } from "./state";

import "./Hrm.scss";
import "./HrmColors.scss";
import HrmConnectingEdge from "./HrmConnectingEdge";
import HrmEditOverlay from "./HrmEditOverlay";

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
	const handleScroll = () => {
		// Reset scroll position.
		if (g.rootRef) {
			if (g.rootRef.scrollLeft != 0 || g.rootRef.scrollTop != 0) {
				g.rootRef.scrollTo(0, 0);
			}
		}
	};
	return (
		<div
			ref={g.rootRef}
			class="hrm-container abs-parent"
			onScroll={handleScroll}>
			<HrmPane
				g={g}
				onClick={() => g.deselectAll()}
				onDoubleClick={e => {
					const p = g.viewPos(e.x, e.y);
					const id = g.addEmptyNode(p);
					setTimeout(() => {
						g.editNode(id);
					}, 100);
				}}
				onLongPress={() => {
					toast("[Hrm] Long press");
				}}>
				<HrmNodes g={g} />
				<HrmConnectingEdge g={g} />
				<HrmEditOverlay g={g} />
			</HrmPane>
		</div>
	);
};

export default Hrm;
