import { Component } from "solid-js";

import { toast } from "@/block/ToastContainer";
import { Nodes as CNodes } from "@/common";

import { Nodes } from "./data";
import HrmPane from "./HrmPane";
import HrmNodes from "./HrmNodes";

import { State } from "./state";

import "./Hrm.scss";
import "./HrmColors.scss";
import HrmConnectingEdge from "./HrmConnectingEdge";
import HrmEditOverlay from "./HrmEditOverlay";
import { parseKeyEvent } from "@/common/event";

export type HrmProps = {
	initialNodes?: CNodes;
	state: State;
};

export type HrmState = {
	nodes: Nodes;
};

const Hrm: Component<HrmProps> = props => {
	const g = props.state;
	const handleScroll = () => {
		// Reset scroll position.
		// When transform & input is used, focus or typing will cause scroll position to the change.
		// Then, pane position move incorrectly and touch is disabled.
		if (g.rootRef) {
			if (g.rootRef.scrollLeft != 0 || g.rootRef.scrollTop != 0) {
				g.rootRef.scrollTo(0, 0);
			}
		}
	};
	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.target !== g.rootRef) return;
		const key = parseKeyEvent(e);
		console.log(key);
		g.handleKey(key);
	};
	const handlePointerEnter = (e: any) => {
		e.currentTarget.focus();
	};
	return (
		<div
			ref={g.rootRef}
			class="hrm-container abs-parent"
			onScroll={handleScroll}
			onKeyDown={handleKeyDown}
			onPointerEnter={handlePointerEnter}
			tabIndex={0}>
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
