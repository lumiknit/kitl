import { Component, createEffect } from "solid-js";

import { Handle, Node } from "./data";
import { GraphState } from "./state";
import { VWrap } from "../common/types";

type HrmHandleProps = {
	g: GraphState;
	node: Node;
	index: number;
	handleW: VWrap<Handle>;
};

const HrmHandle: Component<HrmHandleProps> = props => {
	const [h, update] = props.handleW;
	let handleRef: HTMLDivElement | undefined;

	createEffect(() => {
		if (!handleRef) return;
		update(h => ({
			...h,
			ref: handleRef,
			selected: false,
		}));
	});

	return (
		<>
			<div ref={handleRef} class="hrm-node-body hrm-handle">
				{h().name}
			</div>
		</>
	);
};

export default HrmHandle;
