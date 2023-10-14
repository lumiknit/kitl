import { Component, createEffect } from "solid-js";

import { Node } from "./data";
import { State } from "./state";
import { HandleID, NodeID } from "@/common";
import { addConnectionPointerEvents } from "./common-events";

type HrmNewHandleProps = {
	g: State;
	nodeID: NodeID;
	handleID: HandleID;
	node: Node;
};

const HrmNewHandle: Component<HrmNewHandleProps> = props => {
	let handleRef: HTMLDivElement | undefined;

	createEffect(() => {
		if (!handleRef) return;
		addConnectionPointerEvents(
			props.g,
			handleRef,
			props.nodeID,
			props.handleID,
		);
	});

	return (
		<div
			ref={handleRef}
			class={`hrm-node-item hrm-handle-new ${
				props.handleID < 0 ? "lhs" : "rhs"
			}`}
		/>
	);
};

export default HrmNewHandle;
