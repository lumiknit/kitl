import { Show } from "solid-js";

import { Handle, Node, Nodes, cStr } from "./data";
import { GraphState } from "./state";
import { VWrap, nearestPointInPill } from "../common";

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
		const nref = node.ref,
			href = handle.ref,
			hl = href.clientLeft + href.offsetLeft,
			ht = href.clientTop + href.offsetTop,
			hw = href.clientWidth,
			hh = href.clientHeight,
			nl = nref.offsetLeft,
			nt = nref.offsetTop,
			ncl = nref.clientLeft,
			nct = nref.clientTop,
			x = nl + ncl + hl + hw / 2,
			y = nt + nct + ht + hh / 2;

		const nodes: Nodes = props.g.nodes();
		const src = nodes.get(handle.sourceID);
		if (!src) return;
		const srcNode = src[0]();
		const pos = srcNode.position;
		const size = srcNode.size;
		const [x2, y2, vx2, vy2] = nearestPointInPill(
			x,
			y,
			pos.x,
			pos.y,
			size.w,
			size.h,
		);
		const [x1, y1, vx1, vy1] = nearestPointInPill(
			x2,
			y2,
			nl + ncl + hl,
			nt + nct + ht,
			hw,
			hh,
		);

		const dist = 0.125 * Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

		return `M ${x1} ${y1} C ${x1 + vx1 * dist} ${y1 + vy1 * dist}, ${
			x2 + vx2 * dist
		} ${y2 + vy2 * dist}, ${x2} ${y2}`;
	};

	return (
		<Show when={h().sourceID}>
			<path
				class={`hrm-edge-path ${cStr(h().color)}`}
				stroke-width="4px"
				fill="transparent"
				d={path()}
			/>
		</Show>
	);
};

export default HrmEdge;
