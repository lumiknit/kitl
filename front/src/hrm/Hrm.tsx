import { Component, createEffect } from "solid-js";

import { toast } from "@/block/ToastContainer";

import { Nodes } from "./data";
import HrmPane from "./HrmPane";
import HrmNodes from "./HrmNodes";

import { State } from "./state";

import "./Hrm.scss";
import "./HrmColors.scss";
import HrmConnectingEdge from "./HrmConnectingEdge";
import { parseKeyEvent } from "@/common/event";

export type HrmProps = {
	state: State;
};

export type HrmState = {
	nodes: Nodes;
};

const Hrm: Component<HrmProps> = props => {
	let rootRef: HTMLDivElement | undefined;
	createEffect(() => {
		console.log("Update rootRef", rootRef);
		props.state.rootRef = rootRef;
	});
	const handleScroll = () => {
		// Reset scroll position.
		// When transform & input is used, focus or typing will cause scroll position to the change.
		// Then, pane position move incorrectly and touch is disabled.
		if (props.state.rootRef) {
			if (
				props.state.rootRef.scrollLeft != 0 ||
				props.state.rootRef.scrollTop != 0
			) {
				props.state.rootRef.scrollTo(0, 0);
			}
		}
	};
	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.target !== props.state.rootRef) return;
		const key = parseKeyEvent(e);
		console.log(key);
		props.state.handleKey(key);
	};
	const handlePointerEnter = (e: any) => {
		e.currentTarget.focus();
	};
	return (
		<div
			ref={rootRef}
			class="hrm-container abs-parent"
			onScroll={handleScroll}
			onKeyDown={handleKeyDown}
			onPointerEnter={handlePointerEnter}
			tabIndex={0}>
			<HrmPane
				g={props.state}
				onClick={() => props.state.deselectAll()}
				onDoubleClick={e => {
					const p = props.state.viewPos(e.x, e.y);
					const id = props.state.addEmptyNode(p);
					setTimeout(() => {
						props.state.editNode(id);
					}, 100);
				}}
				onLongPress={() => {
					toast("[Hrm] Long press");
				}}>
				<HrmNodes g={props.state} />
				<HrmConnectingEdge g={props.state} />
			</HrmPane>
		</div>
	);
};

export default Hrm;
