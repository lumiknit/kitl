import { Component, JSX } from "solid-js";
import { State } from "./state";
import { Rect, pathBetweenPills } from "@/common";

type HrmEditingEdgeProps = {
	g: State;
};

const HrmEditingEdge: Component<HrmEditingEdgeProps> = props => {
	const path = () => {
		const e = props.g.editingEdge[0]();
		if (!e || e.nodeID === undefined) return "";
		const node = props.g.nodes().get(e.nodeID);
		if (!node) return "";
		const n = node[0]();
		let ref = n.ref;
		if (e.handleID !== undefined) {
			const h = n.handles[e.handleID][0]();
			if (!h.ref) return "";
			ref = h.ref;
		}
		if (!ref) return "";
		const rect = props.g.viewRect(ref);
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
		if (!e || e.nodeID === undefined) return {};
		const node = props.g.nodes().get(e.nodeID);
		if (!node) return {};
		const n = node[0]();
		let ref = n.ref;
		if (e.handleID !== undefined) {
			const h = n.handles[e.handleID][0]();
			if (!h.ref) return {};
			ref = h.ref;
		}
		if (!ref) return {};
		const rect = props.g.viewRect(ref);
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
			<svg class="hrm-edges">
				<path
					class={`hrm-edge-path hrm-c-stroke-empty`}
					stroke-width="3px"
					fill="transparent"
					d={path()}
				/>
			</svg>
			<div class="hrm-editing-edge-handle" style={style()} />
		</>
	);
};

export default HrmEditingEdge;
