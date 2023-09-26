import { Component, JSXElement, createEffect, createSignal } from "solid-js";

import * as ph from "../common/pointer-helper";
import { VBox } from "../common/types";

export type HrmTransform = {
	x: number; // x offset
	y: number; // y offset
	z: number; // zoom
};

const distanceSquare = (dx: number, dy: number) => dx * dx + dy * dy;

const transformToStyle = (t: HrmTransform) =>
	`translate(${t.x}px, ${t.y}px) scale(${t.z})`;

type HrmPaneProps = {
	children: JSXElement;
	t: HrmTransform;
	u?: VBox<HrmTransform>;
	onClick: (e: ph.ClickEvent) => void;
	onDoubleClick: (e: ph.ClickEvent) => void;
	onLongPress: (e: ph.BaseEvent) => void;
};

const HrmPane: Component<HrmPaneProps> = props => {
	let paneRef: HTMLDivElement | undefined,
		viewRef: HTMLDivElement | undefined;
	const [t, setT] = createSignal<HrmTransform>(props.t);

	if (props.u) {
		props.u[0] = t;
		props.u[1] = setT;
	}

	createEffect(() => {
		if (!paneRef) return;
		return ph.addEventListeners(
			ph.newState({
				onClick: props.onClick,
				onDoubleClick: props.onDoubleClick,
				onLongPress: props.onLongPress,
				onDrag: e => {
					if (!viewRef) return;
					const dx = e.x - e.ox,
						dy = e.y - e.oy;
					if (e.pivot) {
						const newZ = Math.sqrt(
								distanceSquare(
									e.pivot.x - e.x,
									e.pivot.y - e.y,
								) /
									distanceSquare(
										e.pivot.x - e.ox,
										e.pivot.y - e.oy,
									),
							),
							rect = viewRef.getBoundingClientRect();
						// Get size of viewRef
						setT(s => ({
							x: s.x + (dx - rect.width * (newZ - 1)) / 2,
							y: s.y + (dy - rect.height * (newZ - 1)) / 2,
							z: s.z * newZ,
						}));
					} else {
						setT(s => ({
							x: s.x + dx,
							y: s.y + dy,
							z: s.z,
						}));
					}
				},
			}),
			paneRef,
		);
	});

	createEffect(() => {
		if (!paneRef) return;
		paneRef.addEventListener(
			"wheel",
			e => {
				if (!paneRef) return;
				e.preventDefault();
				const newZ = Math.pow(2, e.deltaY / -100),
					rect = paneRef.getBoundingClientRect();
				setT(s => ({
					x: s.x * newZ - (e.clientX - rect.left) * (newZ - 1),
					y: s.y * newZ - (e.clientY - rect.top) * (newZ - 1),
					z: s.z * newZ,
				}));
			},
			{ passive: false },
		);
	});

	return (
		<div ref={paneRef} class="hrm-pane">
			<div
				class="hrm-view"
				ref={viewRef}
				style={{
					transform: transformToStyle(t()),
				}}>
				{props.children}
			</div>
		</div>
	);
};

export default HrmPane;
