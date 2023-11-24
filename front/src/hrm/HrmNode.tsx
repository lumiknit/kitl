import { For, Show, createEffect, createSignal } from "solid-js";
import {
	Getter,
	LEFT_EXPANDABLE_NODES,
	NON_SOURCE_NODES,
	NodeID,
	RIGHT_EXPANDABLE_NODES,
} from "@/common";
import { Handle, Node } from "./data";

import { addEventListeners } from "@/common/pointer-helper";
import { VWrap } from "@/common";
import HrmHandle from "./HrmHandle";
import { State } from "./state";
import HrmNodeBody from "./HrmNodeBody";
import HrmNewHandle from "./HrmNewHandle";

type HrmNodeProps = {
	g: State;
	id: NodeID;
	nodeW: VWrap<Node>;
};

const HrmNode = (props: HrmNodeProps) => {
	const [handleHover, setHandleHover]: VWrap<boolean> = createSignal(false);
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
		addEventListeners(
			{
				capture: true,
				onEnter: pointerID => {
					const e = props.g.connectingEdge[0]();
					if (e && e.pointerID === pointerID && !e.isSource) {
						props.g.setTempConnectingEnd(
							props.id,
							nodeRef,
							undefined,
						);
					}
				},
				onLeave: () => {
					const cee = props.g.connectingEnd[0]();
					if (cee.ref === handleRef) {
						props.g.unsetTempConnectingEnd(handleRef);
					}
				},
				onUp: e => {
					const ce = props.g.connectingEdge[0]();
					if (ce) {
						props.g.addConnectingEnd(
							e.id,
							props.id,
							undefined,
							props.g.viewPos(e.x, e.y),
						);
					}
				},
				onClick: e => {
					const modifier = e.modifiers.shift || e.modifiers.ctrl;
					if (!e.dragged && modifier) {
						props.g.selectOneNode(props.id, modifier);
					}
				},
				onDrag: e => {
					if (n().selected) {
						props.g.translateSelectedNodes(
							e.dx,
							e.dy,
							props.g.transform[0]().z,
						);
					} else {
						props.g.translateOneNode(
							props.id,
							e.dx,
							e.dy,
							props.g.transform[0]().z,
						);
					}
				},
				onDoubleClick: () => {
					setTimeout(() => {
						props.g.editNode(props.id);
					}, 100);
				},
				onLongPress: () => {
					props.g.selectOneNodeWithMode(props.id);
				},
			},
			nodeRef,
		);
	});

	createEffect(() => {
		if (!handleRef) return;
		addEventListeners(
			{
				onEnter: () => {
					setHandleHover(true);
				},
				onLeave: () => {
					setHandleHover(false);
				},
				onDown: e => {
					props.g.addConnectingEnd(
						e.id,
						props.id,
						undefined,
						props.g.viewPos(e.x, e.y),
					);
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

	return (
		<div
			classList={{
				"hrm-node": true,
				"hrm-node-root": NON_SOURCE_NODES.has(n().data.type),
				"abs-lt": true,
				selected: n().selected,
				"hrm-pill": true,
				"no-user-select": true,
			}}
			ref={nodeRef}
			style={{
				left: `${n().position.x}px`,
				top: `${n().position.y}px`,
				...props.g.nodeColorBd(n().color),
			}}>
			<Show when={LEFT_EXPANDABLE_NODES.has(n().data.type)}>
				<HrmNewHandle
					g={props.g}
					nodeID={props.id}
					handleID={-Infinity}
					node={n()}
				/>
			</Show>
			<div class="hrm-node-row no-user-select">
				<For each={n().handles.slice(0, n().handles.lhs)}>
					{hrmHandle}
				</For>
				<HrmNodeBody data={n().data} />
				<For each={n().handles.slice(n().handles.lhs)}>
					{hrmHandleRHS}
				</For>
			</div>
			<Show when={RIGHT_EXPANDABLE_NODES.has(n().data.type)}>
				<HrmNewHandle
					g={props.g}
					nodeID={props.id}
					handleID={Infinity}
					node={n()}
				/>
			</Show>
			<Show when={!NON_SOURCE_NODES.has(n().data.type)}>
				<div
					ref={handleRef}
					class={`hrm-node-handle hrm-pill ${
						handleHover() ? "opacity-100" : ""
					}`}
				/>
			</Show>
		</div>
	);
};

export default HrmNode;
