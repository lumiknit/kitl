import { Component, batch, createEffect, createSignal } from "solid-js";

import { Handle, HandleType, Node, cBd, cBdEmpty, cBg } from "./data";
import { State } from "./state";
import { VWrap } from "@/common/types";
import { addEventListeners, newState } from "@/common/pointer-helper";
import { toast } from "@/block/ToastContainer";
import { HandleID, NodeID } from "@/common";

type HrmHandleProps = {
	g: State;
	nodeID: NodeID;
	handleID: HandleID;
	node: Node;
	handleW: VWrap<Handle>;
};

const HrmHandle: Component<HrmHandleProps> = props => {
	const [h, update] = props.handleW;
	let handleRef: HTMLDivElement | undefined;

	createEffect(() => {
		if (!handleRef) return;
		h();
		update(h => {
			let color, colorClass;
			if (h.data.type === HandleType.Source) {
				color = h.data.color;
				colorClass = cBd(color);
			} else if (h.data.sourceID) {
				const nodeV = props.g.nodes().get(h.data.sourceID);
				if (nodeV) {
					const node = nodeV[0]();
					color = node.color;
					if (h.data.sourceHandle) {
						color = node.handles[h.data.sourceHandle][0]().color;
					}
					colorClass = cBg(color);
				}
			}
			if (
				color === h.color &&
				colorClass === h.colorClass &&
				h.ref === handleRef
			) {
				return h;
			}
			return {
				...h,
				ref: handleRef,
				color,
				colorClass,
			};
		});
	});

	createEffect(() => {
		if (!handleRef) return;
		return addEventListeners(
			newState({
				onPress: e => {
					props.g.editEdge(props.nodeID, props.handleID);
				},
			}),
			handleRef,
		);
	});

	return (
		<>
			<div
				ref={handleRef}
				class={`hrm-node-item hrm-handle ${
					h().colorClass ?? cBdEmpty
				}`}>
				{h().name}
			</div>
		</>
	);
};

export default HrmHandle;
