import { createEffect, createSignal } from "solid-js";
import { ID, Node, Position } from "./data";

import { addEventListeners, newState } from "../common/pointer-helper";
import { toast } from "../block/ToastContainer";
import { Update, Updater, VBox } from "../common/types";
import { HrmActions } from "./Hrm";

type HrmNodeProps = {
	node: Node;
	actions: HrmActions;
};

const HrmNode = (props: HrmNodeProps) => {
	console.log("[HrmNode] render");
	let nodeRef: HTMLDivElement | undefined;

	const [state, setState] = createSignal<Node>(
		props.node,
		{ equals: false },
	);

	const updatePosition: Updater<Position> = (u) =>
		setState(s => {
			s.position = u(s.position);
			return s;
		});
	const updateSelected: Updater<boolean> = (u) =>
		setState(s => {
			s.ui.selected[0] = u(s.ui.selected[0] ?? false);
			return s;
		});
	
	createEffect(() => {
		if (!nodeRef) return;
		props.node.ui = {
			ref: nodeRef,
			size: {
				w: nodeRef.clientWidth,
				h: nodeRef.clientHeight,
			},
			selected: [false, updateSelected],
			position: [() => state().position, updatePosition],
		};
		return addEventListeners(newState({
			onClick: e => {
				props.actions.selectNodeOne(state().id);
			},
			onDrag: e => {
				props.actions.translateSelectedNodes(state().id, e.x - e.ox, e.y - e.oy);
			},
		}), nodeRef);
	});

	return (
		<div
			class={`hrm-node ${state().ui.selected[0] ? "selected" : ""}`}
			ref={nodeRef}
			style={{
				left: `${state().position.x}px`,
				top: `${state().position.y}px`,
			}}>
			<div class="hrm-node-row">
				<div class="hrm-handle" />
				{props.node.id}
				<div class="hrm-handle" />
				<div class="hrm-handle" />
			</div>
		</div>
	);
};

export default HrmNode;
