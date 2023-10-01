import { For, Show, createEffect } from "solid-js";
import { Getter, NodeID, ROOT_NODES } from "@/common";
import { Handle, Node, cBd } from "./data";

import { addEventListeners } from "@/common/pointer-helper";
import { VWrap } from "@/common";
import HrmHandle from "./HrmHandle";
import { State } from "./state";
import HrmNodeBody from "./HrmNodeBody";

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

	const nodeEvents: { [key: string]: (e: any) => void } = {
		pointerenter: () => {
			if (ROOT_NODES.has(n().data.type)) return;
			props.g.enterEditingEnd(props.id, nodeRef);
		},
		pointerdown: e => {
			e.target?.releasePointerCapture(e.pointerId);
		},
		pointerleave: () => {
			if (ROOT_NODES.has(n().data.type)) return;
			props.g.leaveEditingEnd(nodeRef);
		},
		pointerup: e => {
			if (ROOT_NODES.has(n().data.type)) return;
			props.g.pickEditingEnd(props.id);
			e.stopPropagation();
		},
	};

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
		addEventListeners(
			{
				onClick: () => {
					props.g.selectOneNode(props.id);
				},
				onDrag: e => {
					props.g.translateSelectedNodes(
						props.id,
						e.dx,
						e.dy,
						props.g.transform[0]().z,
					);
				},
				onRelease: () => {
					props.g.resetEditingEdge();
				},
			},
			nodeRef,
		);
		for (const [k, v] of Object.entries(nodeEvents)) {
			nodeRef.addEventListener(k, v, { passive: true });
		}
	});

	createEffect(() => {
		if (!handleRef) return;
		addEventListeners(
			{
				onPress: e => {
					props.g.editEdge(
						props.id,
						undefined,
						props.g.viewPos(e.x, e.y),
					);
				},
				onDrag: e => {
					const p = props.g.viewPos(e.x, e.y);
					if (p) props.g.updateEdgeEnd(p);
				},
				onRelease: () => {
					props.g.resetEditingEdge();
				},
			},
			handleRef,
		);
	});

	const hrmHandle = (handle: VWrap<Handle>, index: Getter<number>) => (
			<HrmHandle
				g={props.g}
				nodeID={props.id}
				node={n()}
				handleID={index()}
				handleW={handle}
			/>
		),
		hrmHandleRHS = (handle: VWrap<Handle>, index: Getter<number>) =>
			hrmHandle(handle, () => index() + n().handles.lhs);

	const position = () => n().position;
	return (
		<div
			class={`hrm-node ${n().selected ? "selected" : ""} ${cBd(
				n().color,
			)}`}
			ref={nodeRef}
			style={{
				left: `${position().x}px`,
				top: `${position().y}px`,
			}}>
			<div class="hrm-node-row">
				<For each={n().handles.slice(0, n().handles.lhs)}>
					{hrmHandle}
				</For>
				<HrmNodeBody data={n().data} />
				<For each={n().handles.slice(n().handles.lhs)}>
					{hrmHandleRHS}
				</For>
			</div>
			<Show when={!ROOT_NODES.has(n().data.type)}>
				<div ref={handleRef} class="hrm-node-handle" />
			</Show>
		</div>
	);
};

export default HrmNode;
