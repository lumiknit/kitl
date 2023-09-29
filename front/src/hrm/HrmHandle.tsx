import { Component, createEffect } from "solid-js";

import { Handle, Node, NodeColor, cBg } from "./data";
import { GraphState } from "./state";
import { VWrap } from "@kitl-common/types";

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
		update(h => {
			let color: NodeColor | undefined = undefined;
			if (h.sourceID) {
				const nodeV = props.g.nodes().get(h.sourceID);
				if (nodeV) {
					const node = nodeV[0]();
					color = node.color;
				}
			}
			console.log("color", color);
			return {
				...h,
				ref: handleRef,
				selected: false,
				color,
			};
		});
	});

	return (
		<>
			<div
				ref={handleRef}
				class={`hrm-node-body hrm-handle ${cBg(h().color)}`}>
				{h().name}
			</div>
		</>
	);
};

export default HrmHandle;
