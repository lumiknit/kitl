import { Component, For, createSignal } from "solid-js";

import "./Hrm.scss";
import { Edge, Node, View } from "./data";
import HrmPane from "./HrmPane";

import { toast } from "../block/ToastContainer";

export type HrmProps = {
	nodes: Node[];
	edges: Edge[];
};

export type HrmState = {
	nodes: Node[];
	edges: Edge[];
};

const Hrm: Component<HrmProps> = props => {
	const [state, setState] = createSignal<HrmState>({
		nodes: props.nodes,
		edges: props.edges,
	});

	let start: undefined | { x: number; y: number } = undefined;

	return (
		<div class="hrm-container">
			<HrmPane
				t={{
					x: 0,
					y: 0,
					z: 1,
				}}
				onClick={(x, y, c) => toast("Click " + c)}
				onDoubleClick={() => toast("Double click")}>
				<For each={props.nodes}>
					{node => <div class="hrm-node">{node.id}</div>}
				</For>
			</HrmPane>
		</div>
	);
};

export default Hrm;
