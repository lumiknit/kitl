import { Component, Show, createEffect, createSignal } from "solid-js";

import { Handle, HandleType, Node, SinkHandleData } from "./data";
import { State } from "./state";
import { HandleID, NodeID, VWrap, pathBetweenPill, pathSelf } from "@/common";
import { addEventListeners } from "@/common/pointer-helper";

type HrmEdgeProps = {
	g: State;
	nodeW: VWrap<Node>;
	handleW: VWrap<Handle>;
	nodeID: NodeID;
	handleID: HandleID;
};

const HrmEdgeSub = (props: HrmEdgeProps) => {
	const [path, setPath] = createSignal<string[]>([]);
	console.log("[HrmEdge] render");

	let clickPathRef: SVGPathElement | undefined;
	const [n] = props.nodeW,
		[h] = props.handleW;

	createEffect(() => {
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
		setPath(
			props.nodeID === sourceID
				? [pathSelf(srcRect, handleRect), pathSelf(srcRect, handleRect)]
				: [
						pathBetweenPill(srcRect, handleRect, 0.5),
						pathBetweenPill(srcRect, handleRect, -0.5),
				  ],
		);
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

	const style = () => {
		const c = h().color;
		return c ? props.g.nodeColorStroke(c) : {};
	};

	return (
		<>
			<path
				classList={{
					"hrm-edge-path": true,
					"hrm-edge-path-bd": true,
				}}
				stroke-width="6px"
				fill="transparent"
				d={path()[1]}
			/>
			<path
				classList={{
					"hrm-edge-path": true,
				}}
				style={style()}
				stroke-width="3px"
				fill="transparent"
				d={path()[0]}
			/>
			<path
				class="cursor-pointer"
				ref={clickPathRef}
				//stroke="#f004"
				stroke-width="1rem"
				fill="transparent"
				d={path()[0]}
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
