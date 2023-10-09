import { Component, JSX } from "solid-js";
import { State } from "./state";
import { Rect, pathBetweenPills } from "@/common";

type HrmEditingEdgeProps = {
	g: State;
};

const HrmEditingEdge: Component<HrmEditingEdgeProps> = props => {
	const path = () => {
		const e = props.g.editingEdge[0]();
		if (!e || !e.nodeID) return "";
		const node = props.g.nodes().get(e.nodeID);
		if (!node) return "";
		const rect = props.g.viewRectOf(e.nodeID, e.handleID);
		if (!rect) return "";
		let endRefRect: Rect | undefined;
		if (e.endRef) {
			endRefRect = props.g.viewRect(e.endRef);
		}
		const endRect = endRefRect ?? {
			x: e.end.x - 4,
			y: e.end.y - 4,
			w: 8,
			h: 8,
		};
		return pathBetweenPills(rect, endRect);
	};
	const style = (): JSX.CSSProperties => {
		// Get node and handle
		const e = props.g.editingEdge[0]();
		if (!e || !e.nodeID) return {};
		const rect = props.g.viewRectOf(e.nodeID, e.handleID);
		if (!rect) return {};
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
				class="hrm-editing-edge-handle no-pointer-events"
				style={style()}
			/>
		</>
	);
};

export default HrmEditingEdge;