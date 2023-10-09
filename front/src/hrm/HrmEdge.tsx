import { Component, Show, createEffect, createMemo } from "solid-js";

import { Handle, HandleType, Node, SinkHandleData, cStr } from "./data";
import { State } from "./state";
import { HandleID, NodeID, VWrap, pathBetweenPills, pathSelf } from "@/common";
import { addEventListeners } from "@/common/pointer-helper";

type HrmEdgeProps = {
	g: State;
	nodeW: VWrap<Node>;
	handleW: VWrap<Handle>;
	nodeID: NodeID;
	handleID: HandleID;
};

const HrmEdgeSub = (props: HrmEdgeProps) => {
	console.log("[HrmEdge] render");

	let clickPathRef: SVGPathElement | undefined;
	const [n] = props.nodeW,
		[h] = props.handleW;

	const path = createMemo(() => {
		console.log("[HrmEdge] Effect (path)");
		n(); // For reactive re-rendering
		// Get target handle
		const handle = h();
		if (handle.data.type !== HandleType.Sink) return "";
		const sourceID = handle.data.sourceID,
			sourceHandle = handle.data.sourceHandle;
		if (sourceID === undefined) return "";
		const srcRect = props.g.viewRectOf(sourceID, sourceHandle),
			handleRect = props.g.viewRect(handle.ref);
		if (!srcRect || !handleRect) return "";
		return props.nodeID === sourceID
			? pathSelf(srcRect, handleRect)
			: pathBetweenPills(srcRect, handleRect);
	});

	createEffect(() => {
		if (!clickPathRef) return;
		return addEventListeners(
			{
				onDoubleClick: () => {
					props.g.deleteEdge(props.nodeID, props.handleID);
				},
			},
			clickPathRef,
		);
	});

	return (
		<>
			<path
				classList={{
					"hrm-edge-path": true,
					[cStr(h().color)]: true,
				}}
				stroke-width="4px"
				fill="transparent"
				d={path()}
			/>
			<path
				class="cursor-pointer"
				ref={clickPathRef}
				//stroke="#f004"
				stroke-width="1rem"
				fill="transparent"
				d={path()}
			/>
		</>
	);
};

const HrmEdge: Component<HrmEdgeProps> = props => {
	const [h] = props.handleW;
	return (
		<Show
			when={
				h().data.type === HandleType.Sink &&
				(h().data as SinkHandleData).sourceID
			}>
			<HrmEdgeSub {...props} />
		</Show>
	);
};

export default HrmEdge;