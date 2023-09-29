import { Show, Switch } from "solid-js";

import {
	Handle,
	HandleType,
	Node,
	Nodes,
	SinkHandleData,
	SourceHandleData,
	cStr,
} from "./data";
import { GraphState } from "./state";
import { VWrap, nearestPointInPill } from "@/common";

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
		if (handle.data.type !== HandleType.Sink) return "";
		const sourceID = handle.data.sourceID;
		const sourceHandle = handle.data.sourceHandle;
		if (!handle.ref || !sourceID) return "";
		let node = n();
		if (!node.ref) return "";
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
		const src = nodes.get(sourceID);
		if (!src) return;
		const srcNode = src[0]();
		const ss = { ...srcNode.position, ...srcNode.size };
		if (sourceHandle) {
			const sh = srcNode.handles[sourceHandle][0]();
			if (!sh.ref) return "";
			ss.x += sh.ref.offsetLeft + sh.ref.clientLeft;
			ss.y += sh.ref.offsetTop + sh.ref.clientTop;
			ss.w = sh.ref.clientWidth;
			ss.h = sh.ref.clientHeight;
		}
		const [x2, y2, vx2, vy2] = nearestPointInPill(
			x,
			y,
			ss.x,
			ss.y,
			ss.w,
			ss.h,
		);
		const [x1, y1, vx1, vy1] = nearestPointInPill(
			x2,
			y2,
			nl + ncl + hl,
			nt + nct + ht,
			hw,
			hh,
		);

		const dist = 0.175 * Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

		return `M ${Math.round(x1)} ${Math.round(y1)}
			C ${Math.round(x1 + vx1 * dist)} ${Math.round(y1 + vy1 * dist)},
			${Math.round(x2 + vx2 * dist)} ${Math.round(y2 + vy2 * dist)},
			${Math.round(x2)} ${Math.round(y2)}`;
	};

	return (
		<Show
			when={
				h().data.type === HandleType.Sink &&
				(h().data as SinkHandleData).sourceID
			}>
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
