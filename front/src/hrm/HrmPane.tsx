import {
	Component,
	For,
	JSXElement,
	createEffect,
	createSignal,
} from "solid-js";

import * as ph from "@/common/pointer-helper";
import { VBox } from "@/common/types";

import { TbZoomIn, TbZoomOut, TbZoomReset } from "solid-icons/tb";

import "./HrmPane.scss";

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
				if (e.ctrlKey || e.metaKey) {
					// Zoom
					const newZ = Math.pow(2, e.deltaY / -100),
						rect = paneRef.getBoundingClientRect();
					setT(s => ({
						x: s.x * newZ - (e.clientX - rect.left) * (newZ - 1),
						y: s.y * newZ - (e.clientY - rect.top) * (newZ - 1),
						z: s.z * newZ,
					}));
				} else {
					setT(s => ({
						x: s.x - e.deltaX,
						y: s.y - e.deltaY,
						z: s.z,
					}));
				}
			},
			{ passive: false },
		);
	});

	type Control = [HTMLButtonElement | undefined, JSXElement, () => void];
	const controls: Control[] = [
		[
			undefined,
			<TbZoomIn />,
			() => {
				setT(s => ({ ...s, z: s.z * 1.1 }));
			},
		],
		[
			undefined,
			<TbZoomOut />,
			() => {
				setT(s => ({ ...s, z: s.z / 1.1 }));
			},
		],
		[
			undefined,
			<TbZoomReset />,
			() => {
				setT(s => ({ ...s, z: 1 }));
			},
		],
	];
	createEffect(() => {
		for (const [ref] of controls) {
			if (!ref) continue;
			ref.addEventListener("mousedown", e => {
				e.stopPropagation();
			});
		}
	});

	return (
		<div ref={paneRef} class="hrm-pane">
			<div class="hrm-pane-controls">
				<For each={controls}>
					{c => (
						<button ref={c[0]} onClick={c[2]}>
							{c[1]}
						</button>
					)}
				</For>
			</div>
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
