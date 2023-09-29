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
	const [n] = props.nodeW;
	return (
		<For each={n().handles}>
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
