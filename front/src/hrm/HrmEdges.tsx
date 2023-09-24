import { Component, For } from "solid-js";

import { Node } from "./data";
import { HrmActions } from "./actions";
import HrmEdge from "./HrmEdge";

type HrmEdgesProps = {
	node: Node;
	actions: HrmActions;
};

const HrmEdges: Component<HrmEdgesProps> = props => {
	return (
		<For each={props.node.handles.items}>
			{(_handle, index) => (
				<HrmEdge
					node={props.node}
					index={index()}
					actions={props.actions}
				/>
			)}
		</For>
	);
};

export default HrmEdges;
