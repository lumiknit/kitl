import { Component, For } from "solid-js";

import { Edge, Node } from "./data";

import HrmEdge from "./HrmEdge";

type HrmEdgesProps = {
	edges: Edge[];
	nodes: Node[];
};

const HrmEdges: Component<HrmEdgesProps> = props => {
	return (
		<div class="hrm-edges">
			<For each={props.edges}>{edge => <HrmEdge edge={edge} />}</For>
		</div>
	);
};

export default HrmEdges;
