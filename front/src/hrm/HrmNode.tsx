import { For, createEffect, createSignal } from "solid-js";
import { Node, Position } from "./data";

import { addEventListeners, newState } from "../common/pointer-helper";
import { Updater } from "../common/types";
import { HrmActions } from "./actions";
import HrmHandle from "./HrmHandle";

type HrmNodeProps = {
	node: Node;
	actions: HrmActions;
};

const HrmNode = (props: HrmNodeProps) => {
	console.log("[HrmNode] render");
	let nodeRef: HTMLDivElement | undefined;

	const [state, setState] = createSignal<Node>(props.node, { equals: false });

	const updatePosition: Updater<Position> = u =>
		setState(s => {
			s.position = u(s.position);
			return s;
		});
	const updateSelected: Updater<boolean> = u =>
		setState(s => {
			s.ui.selected[0] = u(s.ui.selected[0] ?? false);
			return s;
		});

	createEffect(() => {
		if (!nodeRef) return;
		const ui = props.node.ui;
		ui.ref = nodeRef;
		ui.size = {
			w: nodeRef.clientWidth,
			h: nodeRef.clientHeight,
		};
		ui.selected[1] = updateSelected;
		ui.position = [() => state().position, updatePosition];
		// DO NOT touch handles
		return addEventListeners(
			newState({
				onClick: e => {
					props.actions.selectNodeOne(state().id);
				},
				onDrag: e => {
					props.actions.translateSelectedNodes(
						state().id,
						e.x - e.ox,
						e.y - e.oy,
					);
				},
			}),
			nodeRef,
		);
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
				<For each={state().handles.items.slice(0, state().handles.lhs)}>
					{(_handle, index) => (
						<HrmHandle node={state()} index={index()} />
					)}
				</For>
				<div class="hrm-node-body">{props.node.id}</div>
				<For each={state().handles.items.slice(state().handles.lhs)}>
					{(_handle, index) => (
						<HrmHandle
							node={state()}
							index={index() + state().handles.lhs}
						/>
					)}
				</For>
			</div>
		</div>
	);
};

export default HrmNode;
