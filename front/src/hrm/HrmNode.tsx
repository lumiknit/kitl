import { For, Show, createEffect, createSignal, onMount } from "solid-js";
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
import { HrmNodeBody, HrmNodeDetails } from "./HrmNodeBody";
import HrmNewHandle from "./HrmNewHandle";

type HrmNodeProps = {
	g: State;
	id: NodeID;
	nodeW: VWrap<Node>;
};

const HrmNode = (props: HrmNodeProps) => {
	const [handleHover, setHandleHover]: VWrap<boolean> = createSignal(false);
	const [showDetails, setShowDetails] = createSignal(false);
	console.log("[HrmNode] render");
	let nodeRef: HTMLDivElement | undefined,
		handleRef: HTMLDivElement | undefined;

	createEffect(() => {
		if (!nodeRef) return;
		const ref = nodeRef;
		props.nodeW[1](n => ({
			...n,
			ref: ref,
			size: {
				w: ref.offsetWidth,
				h: ref.offsetHeight,
			},
		}));
	});

	onMount(() => {
		if (!nodeRef) return;
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
					if (!e.dragged) {
						if (modifier || props.g.selectMode) {
							props.g.selectOneNode(props.id, modifier);
						} else {
							setShowDetails(v => !v);
						}
					}
				},
				onDrag: e => {
					if (props.nodeW[0]().selected) {
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
					props.g.editNode(props.id);
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
				node={props.nodeW[0]()}
				handleID={index()}
				handleW={handle}
			/>
		),
		hrmHandleRHS = (handle: VWrap<Handle>, index: Getter<number>) =>
			hrmHandle(handle, () => index() + props.nodeW[0]().handles.lhs);

	return (
		<>
			<div
				classList={{
					"hrm-node": true,
					"hrm-node-root": NON_SOURCE_NODES.has(
						props.nodeW[0]().data.type,
					),
					"abs-lt": true,
					selected: props.nodeW[0]().selected,
					"hrm-pill": true,
					"no-user-select": true,
				}}
				ref={nodeRef}
				style={{
					left: `${props.nodeW[0]().position.x}px`,
					top: `${props.nodeW[0]().position.y}px`,
					...props.g.nodeColorBd(props.nodeW[0]().color),
				}}>
				<Show
					when={LEFT_EXPANDABLE_NODES.has(
						props.nodeW[0]().data.type,
					)}>
					<HrmNewHandle
						g={props.g}
						nodeID={props.id}
						handleID={-Infinity}
						node={props.nodeW[0]()}
					/>
				</Show>
				<div class="hrm-node-row no-user-select">
					<For
						each={props.nodeW[0]().handles.slice(
							0,
							props.nodeW[0]().handles.lhs,
						)}>
						{hrmHandle}
					</For>
					<HrmNodeBody data={props.nodeW[0]().data} />
					<For
						each={props.nodeW[0]().handles.slice(
							props.nodeW[0]().handles.lhs,
						)}>
						{hrmHandleRHS}
					</For>
				</div>
				<Show
					when={RIGHT_EXPANDABLE_NODES.has(
						props.nodeW[0]().data.type,
					)}>
					<HrmNewHandle
						g={props.g}
						nodeID={props.id}
						handleID={Infinity}
						node={props.nodeW[0]()}
					/>
				</Show>
				<Show when={!NON_SOURCE_NODES.has(props.nodeW[0]().data.type)}>
					<div
						ref={handleRef}
						classList={{
							"hrm-node-handle": true,
							"hrm-pill": true,
							"opacity-100": handleHover(),
						}}
					/>
				</Show>
			</div>
			<Show when={showDetails()}>
				<HrmNodeDetails
					nodeW={props.nodeW}
					data={props.nodeW[0]().data}
					onClick={() => setShowDetails(false)}
				/>
			</Show>
		</>
	);
};

export default HrmNode;
