import { Component, createEffect } from "solid-js";

import { Handle, HandleType, Node, cBdEmpty } from "./data";
import { State } from "./state";
import { VWrap } from "@/common/types";
import { addEventListeners } from "@/common/pointer-helper";
import { HandleID, NodeID } from "@/common";
import { addConnectionPointerEvents } from "./common-events";

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
			let color, style;
			if (h.data.type === HandleType.Source) {
				color = h.data.color;
				style = props.g.nodeColorBd(color);
			} else if (h.data.sourceID) {
				const nodeV = props.g.nodes().get(h.data.sourceID);
				if (nodeV) {
					const node = nodeV[0]();
					color = node.color;
					if (h.data.sourceHandle !== undefined) {
						color =
							node.handles[h.data.sourceHandle][0]().color ??
							color;
					}
					style = props.g.nodeColorBg(color);
				}
			}
			return color === h.color && h.ref === handleRef
				? h
				: { ...h, ref: handleRef, color, style };
		});
		addConnectionPointerEvents(
			props.g,
			handleRef,
			props.nodeID,
			props.handleID,
		);
	});

	createEffect(() => {
		if (!handleRef) return;
		addEventListeners(
			{
				onPress: e => {
					props.g.addConnectingEnd(
						props.nodeID,
						props.handleID,
						props.g.viewPos(e.x, e.y),
					);
				},
				onDrag: e => {
					props.g.updateConnectingEnd(props.g.viewPos(e.x, e.y)!);
				},
				onRelease: () => {
					props.g.resetConnectingState();
				},
				onDoubleClick: () => {
					props.g.deleteEdge(props.nodeID, props.handleID);
				},
			},
			handleRef,
		);
	});

	return (
		<>
			<div
				ref={handleRef}
				class={`hrm-node-item hrm-handle ${h().style ? "" : cBdEmpty}`}
				style={h().style}>
				{h().name}
			</div>
		</>
	);
};

export default HrmHandle;
