import { Component, createEffect } from "solid-js";

import {
	Handle,
	HandleType,
	Node,
	NodeColor,
	cBd,
	cBdEmpty,
	cBg,
} from "./data";
import { State } from "./state";
import { VWrap } from "@/common/types";

type HrmHandleProps = {
	g: State;
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
			let color;
			let colorClass = cBdEmpty;
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
			return {
				...h,
				ref: handleRef,
				selected: false,
				color,
				colorClass,
			};
		});
	});

	return (
		<>
			<div
				ref={handleRef}
				class={`hrm-node-item hrm-handle ${h().colorClass}`}>
				{h().name}
			</div>
		</>
	);
};

export default HrmHandle;
