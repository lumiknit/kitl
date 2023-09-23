import { createEffect } from "solid-js";
import { Node } from "./data";

type HrmNodeProps = {
	node: Node;
};

const HrmNode = (props: HrmNodeProps) => {
	let nodeRef: HTMLDivElement | undefined;
	createEffect(() => {
		if (!nodeRef) return;
		// capture mousedown event to prevent propagation to pane
		nodeRef.addEventListener("mousedown", e => {
			e.stopPropagation();
		});
	});
	return (
		<div
			class="hrm-node"
			ref={nodeRef}
			style={{
				left: `${props.node.position.x}px`,
				top: `${props.node.position.y}px`,
			}}>
			<div class="hrm-node-row">
				<div class="hrm-handle" />
				{props.node.id}
				<div class="hrm-handle" />
				<div class="hrm-handle" />
			</div>
		</div>
	);
};

export default HrmNode;
