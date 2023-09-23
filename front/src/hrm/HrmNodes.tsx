import { Component, For } from "solid-js";

import { Node } from "./data";

import HrmNode from "./HrmNode";
import { HrmActions } from "./actions";

type HrmNodesProps = {
	nodes: Node[];
	actions: HrmActions;
};

const HrmNodes: Component<HrmNodesProps> = props => {
	return (
		<div class="hrm-nodes">
			<For each={props.nodes}>{node =>
				<HrmNode
					node={node}
					actions={props.actions}
				/>
			}</For>
		</div>
	);
};

export default HrmNodes;
