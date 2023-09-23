import { Component, For, createSignal } from "solid-js";

import "./Hrm.scss";
import { Edge, Node, View } from "./data";
import HrmPane from "./HrmPane";

import { toast } from "../block/ToastContainer";
import HrmNodes from "./HrmNodes";
import HrmEdges from "./HrmEdges";

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
				onClick={e => {toast("Click " + e.pointers);}}
				onDoubleClick={e => {toast("Double click " + e.pointers);}}
				onLongPress={e => {toast("Long press");}}
			>
				<HrmNodes nodes={props.nodes} />
				<HrmEdges nodes={props.nodes} edges={props.edges} />
			</HrmPane>
		</div>
	);
};

export default Hrm;
