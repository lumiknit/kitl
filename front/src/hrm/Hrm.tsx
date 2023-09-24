import { Component, createSignal } from "solid-js";

import "./Hrm.scss";
import { Node } from "./data";
import HrmPane, { HrmTransform } from "./HrmPane";

import { toast } from "../block/ToastContainer";
import HrmNodes from "./HrmNodes";
import { HrmActions } from "./actions";
import { VBox } from "../common/types";

export type HrmProps = {
	nodes: Node[];
};

export type HrmState = {
	nodes: Node[];
};

const Hrm: Component<HrmProps> = props => {
	const [state, setState] = createSignal<HrmState>(
		{
			nodes: props.nodes,
		},
		{ equals: false },
	);

	const transform: VBox<HrmTransform> = [undefined, undefined];

	const actions: HrmActions = {
		getNodes: () => state().nodes,
		getNode: id => {
			for (const node of state().nodes) {
				if (node.id === id) {
					return node;
				}
			}
			return undefined;
		},

		translateSelectedNodes: (id: string, dx: number, dy: number) => {
			const zoom = transform[0]?.().z ?? 1;
			for (const node of state().nodes) {
				if (node.id === id || node.ui.selected[0]) {
					node.ui.position[1]?.(p => ({
						x: p.x + dx / zoom,
						y: p.y + dy / zoom,
					}));
				}
			}
		},
		selectAll: () => {
			for (const node of state().nodes) {
				node.ui.selected[1]?.(() => true);
			}
		},
		deselectAll: () => {
			for (const node of state().nodes) {
				if (node.ui.selected[0]) {
					node.ui.selected[1]?.(() => false);
				}
			}
		},
		selectNodeOne(id) {
			// Check is selected
			let selected: boolean | undefined;
			for (const node of state().nodes) {
				if (node.id === id) {
					selected = node.ui.selected[0];
					break;
				}
			}
			for (const node of state().nodes) {
				if (node.id === id) {
					node.ui.selected[1]?.(() => !selected);
				} else {
					node.ui.selected[1]?.(() => false);
				}
			}
		},
	};

	return (
		<div class="hrm-container">
			<HrmPane
				t={{
					x: 0,
					y: 0,
					z: 1,
				}}
				u={transform}
				onClick={e => actions.deselectAll()}
				onDoubleClick={e => {
					toast("Double click " + e.pointers);
				}}
				onLongPress={e => {
					toast("Long press");
				}}>
				<HrmNodes nodes={state().nodes} actions={actions} />
			</HrmPane>
		</div>
	);
};

export default Hrm;
