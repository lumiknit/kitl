import { Component, JSX, createEffect } from "solid-js";
import { State } from "./state";
import { pathBetweenRects } from "@/common";

type HrmConnectingEdgeProps = {
	g: State;
};

const HrmConnectingEdge: Component<HrmConnectingEdgeProps> = props => {
	const nodeRect = () => {
		const e = props.g.connectingEdge[0]();
		return !e ? undefined : props.g.viewRectOf(e.nodeID, e.handleID);
	};
	const path = () => {
		const e = props.g.connectingEdge[0]();
		if (!e) return;
		const ee = props.g.connectingEnd[0](),
			node = props.g.nodes().get(e.nodeID),
			rect = props.g.viewRectOf(e.nodeID, e.handleID);
		if (!node || !rect) return;
		const endRefRect = props.g.viewRect(ee.ref);
		if (!endRefRect) return;
		return pathBetweenRects(rect, endRefRect, 0);
	};
	const handleClass = (): string =>
		nodeRect()?.angular ? `hrm-rect` : `hrm-pill`;
	const style = (): JSX.CSSProperties | undefined => {
		// Get node and handle
		const rect = nodeRect();
		if (rect)
			return {
				visibility: "visible",
				left: `${rect.x}px`,
				top: `${rect.y}px`,
				width: `${rect.w}px`,
				height: `${rect.h}px`,
			};
	};
	createEffect(() => {
		console.log(nodeRect());
	});
	return (
		<>
			<svg class="hrm-edges no-user-select no-pointer-events">
				<path
					class={`hrm-edge-path hrm-c-stroke-empty`}
					stroke-width="2px"
					fill="transparent"
					d={path()}
				/>
			</svg>
			<div
				class={`hrm-editing-edge-handle no-pointer-events ${handleClass()}`}
				style={style()}
			/>
		</>
	);
};

export default HrmConnectingEdge;
