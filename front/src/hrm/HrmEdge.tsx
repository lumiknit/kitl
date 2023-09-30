import { Show, createEffect, createSignal } from "solid-js";

import { Handle, HandleType, Node, SinkHandleData, cStr } from "./data";
import { State } from "./state";
import { HandleID, NodeID, VWrap, pathBetweenPills, pathSelf } from "@/common";
import { addEventListeners, newState } from "@/common/pointer-helper";
import { toast } from "@/block/ToastContainer";

type HrmEdgeProps = {
	g: State;
	nodeW: VWrap<Node>;
	handleW: VWrap<Handle>;
	nodeID: NodeID;
	handleID: HandleID;
};

const HrmEdge = (props: HrmEdgeProps) => {
	console.log("[HrmEdge] render");

	let clickPathRef: SVGPathElement | undefined;
	const [n] = props.nodeW;
	const [h, update] = props.handleW;

	const path = () => {
		console.log("[HrmEdge] Effect (path)");
		n(); // For reactive re-rendering
		// Get target handle
		const handle = h();
		if (handle.data.type !== HandleType.Sink) return "";
		const sourceID = handle.data.sourceID,
			sourceHandle = handle.data.sourceHandle;
		if (!handle.ref || sourceID === undefined) return "";
		// Get source node or handle
		const src = props.g.nodes().get(sourceID);
		if (!src) return;
		const srcNode = src[0]();
		let srcRef = srcNode.ref;
		if (sourceHandle !== undefined) {
			const sh = srcNode.handles[sourceHandle][0]();
			if (!sh.ref) return "";
			srcRef = sh.ref;
		}
		if (!srcRef) return "";
		const handleRect = props.g.viewRect(handle.ref),
			srcRect = props.g.viewRect(srcRef);
		if (!srcRect || !handleRect) return "";
		return props.nodeID === sourceID
			? pathSelf(srcRect, handleRect)
			: pathBetweenPills(srcRect, handleRect);
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
			<path
				class="cursor-pointer"
				ref={clickPathRef}
				stroke="#f004"
				stroke-width="1rem"
				fill="transparent"
				d={path()}
				onClick={() => {
					toast("ASD");
				}}
				onDblClick={() => {
					props.g.deleteEdge(props.nodeID, props.handleID);
				}}
			/>
		</Show>
	);
};

export default HrmEdge;
