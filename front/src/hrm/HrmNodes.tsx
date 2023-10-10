import { Component, For } from "solid-js";

import HrmNode from "./HrmNode";
import HrmEdges from "./HrmEdges";
import { State } from "./state";

type HrmNodesProps = {
	g: State;
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
			<svg class="hrm-edges no-user-select no-pointer-events">
				<For each={[...props.g.nodes()]}>
					{([id, nodeW]) => (
						<HrmEdges g={props.g} id={id} nodeW={nodeW} />
					)}
				</For>
			</svg>
		</>
	);
};

export default HrmNodes;
