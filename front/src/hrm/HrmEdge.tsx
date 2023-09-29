import { Show, createEffect } from "solid-js";

import { Handle, HandleType, Node, SinkHandleData, cStr } from "./data";
import { State } from "./state";
import { VWrap, nearestPointInPill } from "@/common";
import { addEventListeners, newState } from "@/common/pointer-helper";
import { toast } from "@/block/ToastContainer";

type HrmEdgeProps = {
	g: State;
	nodeW: VWrap<Node>;
	handleW: VWrap<Handle>;
	index: number;
};

const HrmEdge = (props: HrmEdgeProps) => {
	let clickPathRef: SVGPathElement | undefined;
	const [n] = props.nodeW;
	const [h, update] = props.handleW;

	const path = () => {
		n(); // For reactive re-rendering
		// Get target handle
		const handle = h();
		if (handle.data.type !== HandleType.Sink) return "";
		const sourceID = handle.data.sourceID,
			sourceHandle = handle.data.sourceHandle;
		if (!handle.ref || !sourceID) return "";
		// Get source node or handle
		const src = props.g.nodes().get(sourceID);
		if (!src) return;
		const srcNode = src[0]();
		let srcRef = srcNode.ref;
		if (sourceHandle) {
			const sh = srcNode.handles[sourceHandle][0]();
			if (!sh.ref) return "";
			srcRef = sh.ref;
		}
		if (!srcRef) return "";
		const handleRect = props.g.viewRect(handle.ref),
			srcRect = props.g.viewRect(srcRef);
		if (!srcRect || !handleRect) return "";
		const [x2, y2, vx2, vy2] = nearestPointInPill(
			handleRect.x + handleRect.w / 2,
			handleRect.y + handleRect.h / 2,
			srcRect,
		);
		const [x1, y1, vx1, vy1] = nearestPointInPill(x2, y2, handleRect);
		const dist = 0.2 * Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
		return `M ${x1 - 0.5 * vx1} ${y1 - 0.5 * vy1}
			C ${x1 + vx1 * dist} ${y1 + vy1 * dist},
			${x2 + vx2 * dist} ${y2 + vy2 * dist},
			${x2 - 0.5 * vx2} ${y2 - 0.5 * vy2}`;
	};

	createEffect(() => {
		if (!clickPathRef) return;
		return addEventListeners(
			newState({
				onClick: e => {
					toast("edge clicked");
				},
			}),
			clickPathRef,
		);
	});

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
			<path
				class="cursor-pointer"
				ref={clickPathRef}
				stroke="#f004"
				stroke-width="1rem"
				fill="transparent"
				d={path()}
			/>
		</Show>
	);
};

export default HrmEdge;
