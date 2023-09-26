import { Show, createEffect, createSignal } from "solid-js";

import { Handle, Node, Nodes } from "./data";
import { GraphState } from "./state";
import { VWrap } from "../common/types";

type HrmEdgeProps = {
	g: GraphState;
	nodeW: VWrap<Node>;
	handleW: VWrap<Handle>;
	index: number;
};

const HrmEdge = (props: HrmEdgeProps) => {
	const [n] = props.nodeW;
	const [h, update] = props.handleW;

	const path = () => {
		const handle = h();
		const node = n();
		if (!handle.sourceID) return "";
		if (!node.ref) return "";
		if (!handle.ref) return "";
		const href = handle.ref;
		const p = node.position;
		const x = p.x + href.offsetLeft + href.offsetWidth / 2;
		const y = p.y + href.offsetTop + href.offsetHeight / 2;

		const nodes: Nodes = props.g.nodes();
		const src = nodes.get(handle.sourceID);
		if (!src) return;
		const srcNode = src[0]();
		const pos = srcNode.position;
		const size = srcNode.size;
		const x2 = pos.x + size.w / 2;
		const y2 = pos.y + size.h / 2;

		return `M ${x} ${y} l ${x2 - x} ${y2 - y}`;
	};

	return (
		<Show when={h().sourceID}>
			<svg class="hrm-edge">
				<path
					class="hrm-edge-path"
					stroke="black"
					stroke-width="0.25rem"
					d={path()}
				/>
			</svg>
		</Show>
	);
};

export default HrmEdge;
