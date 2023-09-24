import { Show, createEffect, createSignal } from "solid-js";
import { HrmActions } from "./actions";

import { Node } from "./data";

type HrmEdgeProps = {
	actions: HrmActions;
	node: Node;
	index: number;
};

const HrmEdge = (props: HrmEdgeProps) => {
	const handle = props.node.handles.items[props.index];
	const hui = props.node.hui[props.index];

	const [path, setPath] = createSignal<string>("");

	const updatePath = () => {
		if (!handle.sourceID) return;
		if (!props.node.ui.ref) return;
		if (!hui?.ref) return;
		const p = props.node.ui.position[0]?.();
		const x = p.x + hui.ref.offsetLeft + hui.ref.offsetWidth / 2;
		const y = p.y + hui.ref.offsetTop + hui.ref.offsetHeight / 2;

		const src = props.actions.getNode(handle.sourceID);
		console.log(src);
		if (!src) return;
		const pos = src.ui.position[0]?.();
		const size = src.ui.size;
		const x2 = pos?.x ?? 0 + size.w / 2;
		const y2 = pos?.y ?? 0 + size.h / 2;

		const s = `M ${x} ${y} l ${x2 - x} ${y2 - y}`;
		setPath(s);
	};

	createEffect(() => {
		updatePath();
	});

	return (
		<Show when={handle.sourceID}>
			<svg class="hrm-edge">
				<path
					class="hrm-edge-path"
					stroke="black"
					stroke-width="0.25rem"
					d={path()}
				/>
			</svg>
		</Show>
	);
};

export default HrmEdge;
