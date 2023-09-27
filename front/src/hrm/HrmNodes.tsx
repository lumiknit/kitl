import { Component, For } from "solid-js";

import HrmNode from "./HrmNode";
import HrmEdges from "./HrmEdges";
import { GraphState } from "./state";

type HrmNodesProps = {
	g: GraphState;
};

const HrmNodes: Component<HrmNodesProps> = props => {
	return (
		<>
			<For each={[...props.g.nodes()]}>
				{([id, nodeW]) => (
					<>
						<HrmNode g={props.g} id={id} nodeW={nodeW} />
					</>
				)}
			</For>
			<For each={[...props.g.nodes()]}>
				{([id, nodeW]) => (
					<svg class="hrm-edges">
						<HrmEdges g={props.g} id={id} nodeW={nodeW} />
					</svg>
				)}
			</For>
		</>
	);
};

export default HrmNodes;
