import { For, createEffect } from "solid-js";
import { NodeID } from "@/common";
import { Node, cBd } from "./data";

import { addEventListeners, newState } from "@/common/pointer-helper";
import { VWrap } from "@/common";
import HrmHandle from "./HrmHandle";
import { State } from "./state";
import HrmNodeBody from "./HrmNodeBody";
import { toast } from "@/block/ToastContainer";

type HrmNodeProps = {
	g: State;
	id: NodeID;
	nodeW: VWrap<Node>;
};

const HrmNode = (props: HrmNodeProps) => {
	const [n, update]: VWrap<Node> = props.nodeW;
	console.log("[HrmNode] render");
	let nodeRef: HTMLDivElement | undefined,
		handleRef: HTMLDivElement | undefined;

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
					const zoom = props.g.transform[0]().z;
					props.g.translateSelectedNodes(
						props.id,
						(e.x - e.ox) / zoom,
						(e.y - e.oy) / zoom,
						1,
					);
				},
			}),
			nodeRef,
		);
	});

	createEffect(() => {
		if (!handleRef) return;
		return addEventListeners(
			newState({
				onPress: e => {
					props.g.editEdge(props.id);
				},
			}),
			handleRef,
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
				<For each={n().handles.slice(0, n().handles.lhs)}>
					{(handle, index) => (
						<HrmHandle
							g={props.g}
							nodeID={props.id}
							node={n()}
							handleID={index()}
							handleW={handle}
						/>
					)}
				</For>
				<HrmNodeBody data={n().data} />
				<For each={n().handles.slice(n().handles.lhs)}>
					{(handle, index) => (
						<HrmHandle
							g={props.g}
							nodeID={props.id}
							node={n()}
							handleID={index() + n().handles.lhs}
							handleW={handle}
						/>
					)}
				</For>
			</div>
			<div ref={handleRef} class="hrm-node-handle" />
		</div>
	);
};

export default HrmNode;
