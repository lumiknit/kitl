import { Component, For } from "solid-js";

import { Node } from "./data";

import HrmNode from "./HrmNode";
import { HrmActions } from "./actions";
import HrmEdges from "./HrmEdges";

type HrmNodesProps = {
	nodes: Node[];
	actions: HrmActions;
};

const HrmNodes: Component<HrmNodesProps> = props => {
	return (
		<>
			<For each={props.nodes}>
				{node => (
					<>
						<HrmNode node={node} actions={props.actions} />
						<HrmEdges node={node} actions={props.actions} />
					</>
				)}
			</For>
		</>
	);
};

export default HrmNodes;
