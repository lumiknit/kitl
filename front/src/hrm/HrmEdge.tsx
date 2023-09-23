import { createEffect } from "solid-js";
import { Edge } from "./data";

type HrmEdgeProps = {
	edge: Edge;
};

const HrmEdge = (props: HrmEdgeProps) => {
	let clickPathRef: SVGPathElement | undefined;
	const path = `M 0 0 C 100 0, 100 0, 100 100`;
	const stroke = "black";
	const strokeWidth = 2;
	const clickWidth = 30;

	createEffect(() => {
		if (!clickPathRef) return;
		// capture mousedown event to prevent propagation to pane
		clickPathRef.addEventListener("mousedown", e => {
			e.stopPropagation();
		});
	});

	return (
		<svg class="hrm-edge">
			<path
				d={path}
				stroke={stroke}
				stroke-width={strokeWidth}
				fill="none"
			/>
			<path
				ref={clickPathRef}
				d={path}
				stroke="transparent"
				stroke-width={clickWidth}
				fill="none"
				onClick={e => {
					alert("A");
					e.stopPropagation();
				}}
			/>
		</svg>
	);
};

export default HrmEdge;
