import { Component, For } from "solid-js";

import { Node } from "./data";

import HrmNode from "./HrmNode";

type HrmNodesProps = {
	nodes: Node[];
};

const HrmNodes: Component<HrmNodesProps> = props => {
	return (
		<div class="hrm-nodes">
			<For each={props.nodes}>{node => <HrmNode node={node} />}</For>
		</div>
	);
};

export default HrmNodes;
