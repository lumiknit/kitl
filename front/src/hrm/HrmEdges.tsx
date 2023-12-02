import { Component, For } from "solid-js";

import { VWrap, NodeID } from "@/common";

import { Node } from "./data";
import HrmEdge from "./HrmEdge";
import { State } from "./state";

type HrmEdgesProps = {
	g: State;
	id: NodeID;
	nodeW: VWrap<Node>;
};

const HrmEdges: Component<HrmEdgesProps> = props => {
	return (
		<For each={props.nodeW[0]().handles}>
			{(handle, index) => (
				<HrmEdge
					g={props.g}
					nodeW={props.nodeW}
					handleW={handle}
					nodeID={props.id}
					handleID={index()}
				/>
			)}
		</For>
	);
};

export default HrmEdges;
