import { For, createEffect } from "solid-js";
import { ID, Node, cBd } from "./data";

import { addEventListeners, newState } from "@kitl-common/pointer-helper";
import { VWrap } from "@kitl-common";
import HrmHandle from "./HrmHandle";
import { GraphState } from "./state";

type HrmNodeProps = {
	g: GraphState;
	id: ID;
	nodeW: VWrap<Node>;
};

const HrmNode = (props: HrmNodeProps) => {
	const [n, update]: VWrap<Node> = props.nodeW;
	console.log("[HrmNode] render");
	let nodeRef: HTMLDivElement | undefined;

	createEffect(() => {
		if (!nodeRef) return;
		const ref = nodeRef;
		update(n => ({
			...n,
			ref: ref,
			size: {
				w: ref.offsetWidth,
				h: ref.offsetHeight,
			},
			selected: false,
		}));
		// DO NOT touch handles
		return addEventListeners(
			newState({
				onClick: () => {
					props.g.toggleNodeOne(props.id);
				},
				onDrag: e => {
					props.g.translateSelectedNodes(
						props.id,
						e.x - e.ox,
						e.y - e.oy,
						1,
					);
				},
			}),
			nodeRef,
		);
	});

	return (
		<div
			class={`hrm-node ${n().selected ? "selected" : ""} ${cBd(
				n().color,
			)}`}
			ref={nodeRef}
			style={{
				left: `${n().position.x}px`,
				top: `${n().position.y}px`,
			}}>
			<div class="hrm-node-row">
				<For each={n().handles.items.slice(0, n().handles.lhs)}>
					{(handle, index) => (
						<HrmHandle
							g={props.g}
							node={n()}
							index={index() + n().handles.lhs}
							handleW={handle}
						/>
					)}
				</For>
				<div class="hrm-node-body">{props.id}</div>
				<For each={n().handles.items.slice(n().handles.lhs)}>
					{(handle, index) => (
						<HrmHandle
							g={props.g}
							node={n()}
							index={index() + n().handles.lhs}
							handleW={handle}
						/>
					)}
				</For>
			</div>
		</div>
	);
};

export default HrmNode;
