import { For, Show, createEffect } from "solid-js";
import {
	Getter,
	LEFT_EXPANDABLE_NODES,
	NodeID,
	RIGHT_EXPANDABLE_NODES,
	ROOT_NODES,
} from "@/common";
import { Handle, Node } from "./data";

import { addEventListeners } from "@/common/pointer-helper";
import { VWrap } from "@/common";
import HrmHandle from "./HrmHandle";
import { State } from "./state";
import HrmNodeBody from "./HrmNodeBody";
import HrmNewHandle from "./HrmNewHandle";
import { addConnectionPointerEvents } from "./common-events";

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
					props.g.resetConnectingState();
				},
				onDoubleClick: () => {
					props.g.editNode(props.id);
				},
			},
			nodeRef,
		);
		addConnectionPointerEvents(props.g, nodeRef, props.id);
	});

	createEffect(() => {
		if (!handleRef) return;
		addEventListeners(
			{
				onPress: e => {
					props.g.addConnectingEnd(
						props.id,
						undefined,
						props.g.viewPos(e.x, e.y),
					);
				},
				onDrag: e => {
					const p = props.g.viewPos(e.x, e.y);
					if (p) props.g.updateConnectingEnd(p);
				},
				onRelease: () => {
					props.g.resetConnectingState();
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
				"abs-lt": true,
				selected: n().selected,
				"hrm-rect": n().angular,
				"hrm-pill": !n().angular,
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
			<Show when={!ROOT_NODES.has(n().data.type)}>
				<div ref={handleRef} class="hrm-node-handle" />
			</Show>
		</div>
	);
};

export default HrmNode;
