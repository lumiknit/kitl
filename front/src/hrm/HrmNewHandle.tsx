import { Component, createSignal, createEffect } from "solid-js";

import { Node } from "./data";
import { State } from "./state";
import { HandleID, NodeID } from "@/common";
import { addEventListeners } from "@/common/pointer-helper";

type HrmNewHandleProps = {
	g: State;
	nodeID: NodeID;
	handleID: HandleID;
	node: Node;
};

const HrmNewHandle: Component<HrmNewHandleProps> = props => {
	let handleRef: HTMLDivElement | undefined;
	const [hover, setHover] = createSignal(false);

	createEffect(() => {
		if (!handleRef) return;
		addEventListeners(
			{
				onEnter: pointerID => {
					setHover(true);
					const e = props.g.connectingEdge[0]();
					if (e && e.pointerID === pointerID && e.isSource) {
						props.g.setTempConnectingEnd(
							props.nodeID,
							handleRef,
							props.handleID,
						);
					}
				},
				onLeave: () => {
					setHover(false);
					const cee = props.g.connectingEnd[0]();
					if (cee.ref === handleRef) {
						props.g.unsetTempConnectingEnd(handleRef);
					}
				},
				onUp: () => {
					props.g.finConnecting(props.nodeID, props.handleID);
				},
			},
			handleRef,
		);
	});

	return (
		<div
			ref={handleRef}
			class={`hrm-node-item hrm-handle-new hrm-pill ${
				props.handleID < 0 ? "lhs" : "rhs"
			} ${hover() ? "opacity-100" : ""}`}>
			{" "}
			+{" "}
		</div>
	);
};

export default HrmNewHandle;
