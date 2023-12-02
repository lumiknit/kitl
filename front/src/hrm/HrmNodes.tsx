import { Component, Index } from "solid-js";

import HrmNode from "./HrmNode";
import HrmEdges from "./HrmEdges";
import { State } from "./state";

type HrmNodesProps = {
	g: State;
};

const HrmNodes: Component<HrmNodesProps> = props => {
	return (
		<>
			<Index each={[...props.g.nodes()]}>
				{n => <HrmNode g={props.g} id={n()[0]} nodeW={n()[1]} />}
			</Index>
			<svg class="hrm-edges no-user-select no-pointer-events">
				<Index each={[...props.g.nodes()]}>
					{n => <HrmEdges g={props.g} id={n()[0]} nodeW={n()[1]} />}
				</Index>
			</svg>
		</>
	);
};

export default HrmNodes;
