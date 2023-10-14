import { Component, JSX } from "solid-js";
import { State } from "./state";
import { Rect, pathBetweenRects } from "@/common";

type HrmConnectingEdgeProps = {
	g: State;
};

const HrmConnectingEdge: Component<HrmConnectingEdgeProps> = props => {
	const nodeRect = () => {
		const e = props.g.connectingEdge[0]();
		return !e || !e.nodeID
			? undefined
			: props.g.viewRectOf(e.nodeID, e.handleID);
	};
	const path = () => {
		const e = props.g.connectingEdge[0]();
		if (!e.nodeID) return;
		const ee = props.g.connectingEnd[0](),
			node = props.g.nodes().get(e.nodeID),
			rect = props.g.viewRectOf(e.nodeID, e.handleID);
		if (!node || !rect) return;
		let endRefRect: Rect | undefined;
		if (ee.ref) {
			endRefRect = props.g.viewRect(ee.ref);
		}
		return pathBetweenRects(
			rect,
			endRefRect ?? {
				x: ee.pos.x - 4,
				y: ee.pos.y - 4,
				w: 8,
				h: 8,
			},
		);
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
	return (
		<>
			<svg class="hrm-edges no-user-select no-pointer-events">
				<path
					class={`hrm-edge-path hrm-c-stroke-empty`}
					stroke-width="3px"
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
