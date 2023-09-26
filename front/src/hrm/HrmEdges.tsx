import { Component, For } from "solid-js";

import { ID, Node } from "./data";
import HrmEdge from "./HrmEdge";
import { GraphState } from "./state";
import { VWrap } from "../common/types";

type HrmEdgesProps = {
	g: GraphState;
	id: ID;
	nodeW: VWrap<Node>;
};

const HrmEdges: Component<HrmEdgesProps> = props => {
	const [n] = props.nodeW;
	return (
		<For each={n().handles.items}>
			{(handle, index) => (
				<HrmEdge
					g={props.g}
					nodeW={props.nodeW}
					handleW={handle}
					index={index()}
				/>
			)}
		</For>
	);
};

export default HrmEdges;
