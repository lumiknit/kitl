import { Component, Show, createEffect } from "solid-js";

import { HandleUIData, Node } from "./data";

type HrmHandleProps = {
	node: Node;
	index: number;
};

const HrmHandle: Component<HrmHandleProps> = props => {
	let handleRef: HTMLDivElement | undefined;
	const handle = props.node.handles.items[props.index];

	createEffect(() => {
		if (!handleRef) return;
		const hUI: HandleUIData = {
			ref: handleRef,
			selected: [false, () => {}],
		};
		props.node.hui[props.index] = hUI;
	});

	return (
		<>
			<div ref={handleRef} class="hrm-node-body hrm-handle">
				{handle.name}
			</div>
		</>
	);
};

export default HrmHandle;
